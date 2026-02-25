import { createHash } from "crypto";
import { stat, readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { getEnv } from "@/lib/config/env";
import { logApiError, logApiStart, logApiSuccess } from "@/lib/logging";

const DEFAULT_RESUME_PATH = path.join(process.cwd(), "documents", "AmanJain_Resume.pdf");
const DEFAULT_RESUME_FILENAME = "AmanJain_Resume.pdf";
const DEFAULT_RESUME_CACHE_CONTROL = "public, max-age=0, s-maxage=3600, stale-while-revalidate=3600";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/resume";
  const method = request.method;

  logApiStart({ request_id: requestId, route, method });

  const env = getEnv();
  const resumePath = env.resumePath ?? DEFAULT_RESUME_PATH;
  const filename = env.resumeFilename ?? DEFAULT_RESUME_FILENAME;
  const cacheControl = env.resumeCacheControl ?? DEFAULT_RESUME_CACHE_CONTROL;

  try {
    const metadata = await stat(resumePath);
    const etag = createEtag(`${metadata.size}:${metadata.mtimeMs}`);

    if (isIfNoneMatch(request.headers.get("if-none-match"), etag)) {
      const response = new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": cacheControl,
          "x-request-id": requestId
        }
      });

      logApiSuccess({
        request_id: requestId,
        route,
        method,
        status: response.status,
        duration_ms: Date.now() - startedAt
      });
      return response;
    }

    const fileBytes = await readFile(resumePath);
    const response = new NextResponse(fileBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": cacheControl,
        ETag: etag,
        "x-request-id": requestId
      }
    });

    logApiSuccess({
      request_id: requestId,
      route,
      method,
      status: response.status,
      duration_ms: Date.now() - startedAt
    });

    return response;
  } catch (error) {
    const errnoCode = getErrnoCode(error);
    const errorCode = errnoCode === "ENOENT" ? "RESUME_NOT_FOUND" : "RESUME_READ_FAILED";
    const status = errorCode === "RESUME_NOT_FOUND" ? 404 : 500;

    logApiError({
      request_id: requestId,
      route,
      method,
      status,
      duration_ms: Date.now() - startedAt,
      error_code: errorCode,
      error_message: error instanceof Error ? error.message : "Failed to serve resume."
    });

    return jsonError({
      status,
      errorCode,
      message:
        errorCode === "RESUME_NOT_FOUND"
          ? "Resume file not found."
          : error instanceof Error
            ? error.message
            : "Failed to read resume file.",
      requestId
    });
  }
}

function createEtag(source: string): string {
  return `"${createHash("sha1").update(source).digest("hex")}"`;
}

function isIfNoneMatch(ifNoneMatch: string | null, etag: string): boolean {
  if (!ifNoneMatch) {
    return false;
  }
  const matches = ifNoneMatch.split(",").map((token) => token.trim());
  return matches.includes(etag) || matches.includes("*");
}

function getErrnoCode(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const maybeError = error as { code?: unknown };
  return typeof maybeError.code === "string" ? maybeError.code : null;
}
