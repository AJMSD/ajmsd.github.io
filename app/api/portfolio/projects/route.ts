import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { jsonWithEtag } from "@/lib/http/cache";
import { getProjects } from "@/lib/portfolio/repository";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = getRequestId(request.headers);

  try {
    const result = await getProjects();
    return jsonWithEtag({
      request,
      payload: {
        data: result.data,
        source: result.source
      },
      requestId
    });
  } catch (error) {
    return jsonError({
      status: 500,
      errorCode: "PROJECTS_FETCH_FAILED",
      message: error instanceof Error ? error.message : "Failed to load project data.",
      requestId
    });
  }
}
