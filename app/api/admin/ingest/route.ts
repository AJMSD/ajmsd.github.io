import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { requireAdminAuthorization } from "@/lib/auth/admin";
import { clearCanonicalContentCache, loadCanonicalContent } from "@/lib/content/load";
import { toMaterializedPayload } from "@/lib/content/materialize";
import {
  AboutFileSchema,
  EducationFileSchema,
  LinksFileSchema,
  LorsFileSchema,
  ProjectsFileSchema,
  StoryFileSchema,
  WorkFileSchema
} from "@/lib/schemas/content";
import { GameQuestionBankFileSchema } from "@/lib/schemas/game-question";
import {
  MATERIALIZED_KINDS,
  MaterializedKind,
  replaceKind
} from "@/lib/db/materialized-content";
import { logApiError, logApiStart, logApiSuccess } from "@/lib/logging";

const IngestPayloadSchema = z.object({
  work: WorkFileSchema,
  projects: ProjectsFileSchema,
  education: EducationFileSchema,
  about: AboutFileSchema,
  lors: LorsFileSchema,
  story: StoryFileSchema,
  links: LinksFileSchema,
  game_question_bank: GameQuestionBankFileSchema
});

const IngestRequestSchema = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("disk")
  }),
  z.object({
    source: z.literal("payload"),
    payload: IngestPayloadSchema
  })
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/admin/ingest";
  const method = request.method;

  logApiStart({ request_id: requestId, route, method });

  const auth = requireAdminAuthorization(request);
  if (!auth.ok) {
    logApiError({
      request_id: requestId,
      route,
      method,
      status: auth.status,
      duration_ms: Date.now() - startedAt,
      error_code: auth.errorCode,
      error_message: auth.message
    });
    return jsonError({
      status: auth.status,
      errorCode: auth.errorCode,
      message: auth.message,
      requestId
    });
  }

  let parsedBody: z.infer<typeof IngestRequestSchema>;
  try {
    const json = await request.json();
    parsedBody = IngestRequestSchema.parse(json);
  } catch (error) {
    logApiError({
      request_id: requestId,
      route,
      method,
      status: 400,
      duration_ms: Date.now() - startedAt,
      error_code: "INVALID_INGEST_PAYLOAD",
      error_message: error instanceof Error ? error.message : "Request body is invalid."
    });
    return jsonError({
      status: 400,
      errorCode: "INVALID_INGEST_PAYLOAD",
      message: error instanceof Error ? error.message : "Request body is invalid.",
      requestId
    });
  }

  try {
    const canonicalContent =
      parsedBody.source === "disk"
        ? await loadFromDiskForIngest()
        : {
            work: parsedBody.payload.work,
            projects: parsedBody.payload.projects,
            education: parsedBody.payload.education,
            about: parsedBody.payload.about,
            lors: parsedBody.payload.lors,
            story: parsedBody.payload.story,
            links: parsedBody.payload.links,
            game_question_bank: parsedBody.payload.game_question_bank
          };

    const materializedPayload = toMaterializedPayload(canonicalContent);
    const counts: Partial<Record<MaterializedKind, number>> = {};

    for (const kind of MATERIALIZED_KINDS) {
      const records = materializedPayload[kind];
      await replaceKind(kind, records);
      counts[kind] = records.length;
    }

    const response = NextResponse.json(
      {
        ok: true,
        request_id: requestId,
        ingested_counts: counts
      },
      {
        status: 200,
        headers: {
          "x-request-id": requestId
        }
      }
    );

    logApiSuccess({
      request_id: requestId,
      route,
      method,
      status: response.status,
      duration_ms: Date.now() - startedAt,
      details: {
        source: parsedBody.source,
        ingested_kinds: Object.keys(counts).length
      }
    });

    return response;
  } catch (error) {
    logApiError({
      request_id: requestId,
      route,
      method,
      status: 500,
      duration_ms: Date.now() - startedAt,
      error_code: "INGEST_FAILED",
      error_message: error instanceof Error ? error.message : "Failed to ingest canonical content."
    });
    return jsonError({
      status: 500,
      errorCode: "INGEST_FAILED",
      message: error instanceof Error ? error.message : "Failed to ingest canonical content.",
      requestId
    });
  }
}

async function loadFromDiskForIngest() {
  clearCanonicalContentCache();
  return loadCanonicalContent();
}
