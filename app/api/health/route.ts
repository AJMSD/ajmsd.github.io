import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { getHealthStatus } from "@/lib/health/status";
import { logApiError, logApiStart, logApiSuccess } from "@/lib/logging";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();
  const requestId = getRequestId(request.headers);
  const route = "/api/health";
  const method = request.method;

  logApiStart({ request_id: requestId, route, method });

  try {
    const status = await getHealthStatus();
    const response = NextResponse.json(
      {
        ...status,
        request_id: requestId
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
        overall_status: status.overall_status
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
      error_code: "HEALTH_CHECK_FAILED",
      error_message: error instanceof Error ? error.message : "Failed to build health status."
    });
    return jsonError({
      status: 500,
      errorCode: "HEALTH_CHECK_FAILED",
      message: error instanceof Error ? error.message : "Failed to build health status.",
      requestId
    });
  }
}
