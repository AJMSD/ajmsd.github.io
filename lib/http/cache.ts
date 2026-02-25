import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type CacheJsonResponseOptions<TPayload> = {
  request: NextRequest;
  payload: TPayload;
  requestId: string;
  cacheControl?: string;
};

const DEFAULT_CACHE_CONTROL = "public, max-age=0, s-maxage=300, stale-while-revalidate=300";

export function jsonWithEtag<TPayload>(
  options: CacheJsonResponseOptions<TPayload>
): NextResponse<TPayload> {
  const serialized = JSON.stringify(options.payload);
  const etag = createEtag(serialized);
  const ifNoneMatch = options.request.headers.get("if-none-match");

  if (matchesIfNoneMatch(ifNoneMatch, etag)) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": options.cacheControl ?? DEFAULT_CACHE_CONTROL,
        "x-request-id": options.requestId
      }
    });
  }

  return NextResponse.json(options.payload, {
    status: 200,
    headers: {
      ETag: etag,
      "Cache-Control": options.cacheControl ?? DEFAULT_CACHE_CONTROL,
      "x-request-id": options.requestId
    }
  });
}

function createEtag(value: string): string {
  const digest = createHash("sha1").update(value).digest("hex");
  return `"${digest}"`;
}

function matchesIfNoneMatch(ifNoneMatch: string | null, etag: string): boolean {
  if (!ifNoneMatch) {
    return false;
  }
  const values = ifNoneMatch.split(",").map((item) => item.trim());
  return values.includes(etag) || values.includes("*");
}
