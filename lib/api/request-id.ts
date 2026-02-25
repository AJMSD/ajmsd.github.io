import { randomUUID } from "crypto";

const REQUEST_ID_HEADER = "x-request-id";

export function getRequestId(headers: Headers): string {
  const provided = headers.get(REQUEST_ID_HEADER)?.trim();
  if (provided) {
    return provided;
  }
  return randomUUID();
}

export function getRequestIdHeaderName(): string {
  return REQUEST_ID_HEADER;
}
