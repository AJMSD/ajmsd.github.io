import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/error";
import { getRequestId } from "@/lib/api/request-id";
import { jsonWithEtag } from "@/lib/http/cache";
import { getAbout } from "@/lib/portfolio/repository";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = getRequestId(request.headers);

  try {
    const result = await getAbout();
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
      errorCode: "ABOUT_FETCH_FAILED",
      message: error instanceof Error ? error.message : "Failed to load about data.",
      requestId
    });
  }
}
