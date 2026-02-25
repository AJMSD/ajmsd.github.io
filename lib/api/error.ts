import { NextResponse } from "next/server";
import { getRequestIdHeaderName } from "@/lib/api/request-id";

export type ApiErrorBody = {
  error_code: string;
  message: string;
  request_id: string;
};

type ApiErrorOptions = {
  status: number;
  errorCode: string;
  message: string;
  requestId: string;
  headers?: HeadersInit;
};

export function jsonError(options: ApiErrorOptions): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = {
    error_code: options.errorCode,
    message: options.message,
    request_id: options.requestId
  };

  return NextResponse.json(body, {
    status: options.status,
    headers: withRequestIdHeader(options.requestId, options.headers)
  });
}

export function withRequestIdHeader(requestId: string, headers?: HeadersInit): Headers {
  const responseHeaders = new Headers(headers);
  responseHeaders.set(getRequestIdHeaderName(), requestId);
  return responseHeaders;
}
