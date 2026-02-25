import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { jsonWithEtag } from "@/lib/http/cache";
import { logApiError, logApiStart, logApiSuccess } from "@/lib/logging";
import { getSummary } from "@/lib/portfolio/repository";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/portfolio/summary";
  const method = request.method;
  logApiStart({ request_id: requestId, route, method });

  try {
    const result = await getSummary();
    const response = jsonWithEtag({
      request,
      payload: {
        data: result.data,
        source: result.source
      },
      requestId
    });

    logApiSuccess({
      request_id: requestId,
      route,
      method,
      status: response.status,
      duration_ms: Date.now() - startedAt,
      details: { source: result.source }
    });

    return response;
  } catch (error) {
    logApiError({
      request_id: requestId,
      route,
      method,
      status: 500,
      duration_ms: Date.now() - startedAt,
      error_code: "SUMMARY_FETCH_FAILED",
      error_message: error instanceof Error ? error.message : "Failed to load portfolio summary."
    });
    return jsonError({
      status: 500,
      errorCode: "SUMMARY_FETCH_FAILED",
      message: error instanceof Error ? error.message : "Failed to load portfolio summary.",
      requestId
    });
  }
}
