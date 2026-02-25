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
};

export function jsonError(options: ApiErrorOptions): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = {
    error_code: options.errorCode,
    message: options.message,
    request_id: options.requestId
  };

  return NextResponse.json(body, {
    status: options.status,
    headers: {
      [getRequestIdHeaderName()]: options.requestId
    }
  });
}
