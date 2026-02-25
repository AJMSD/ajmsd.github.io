import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { verifyAdminAuthorization } from "@/lib/auth/admin";
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
  const requestId = getRequestId(request.headers);
  const auth = verifyAdminAuthorization(request);
  if (!auth.ok) {
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

    return NextResponse.json(
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
  } catch (error) {
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
