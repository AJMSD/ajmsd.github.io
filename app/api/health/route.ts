import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { getHealthStatus } from "@/lib/health/status";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = getRequestId(request.headers);

  try {
    const status = await getHealthStatus();
    return NextResponse.json(
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
  } catch (error) {
    return jsonError({
      status: 500,
      errorCode: "HEALTH_CHECK_FAILED",
      message: error instanceof Error ? error.message : "Failed to build health status.",
      requestId
    });
  }
}
