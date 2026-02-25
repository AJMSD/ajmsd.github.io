import { NextRequest } from "next/server";
import { getEnv } from "@/lib/config/env";

type AdminAuthResult =
  | { ok: true }
  | { ok: false; status: number; errorCode: string; message: string };

export function verifyAdminAuthorization(request: NextRequest): AdminAuthResult {
  const env = getEnv();
  if (!env.adminToken) {
    return {
      ok: false,
      status: 503,
      errorCode: "ADMIN_TOKEN_MISSING",
      message: "ADMIN_TOKEN is not configured on the server."
    };
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 401,
      errorCode: "UNAUTHORIZED",
      message: "Missing or invalid Authorization header."
    };
  }

  const providedToken = authorization.slice("Bearer ".length).trim();
  if (providedToken !== env.adminToken) {
    return {
      ok: false,
      status: 401,
      errorCode: "UNAUTHORIZED",
      message: "Invalid admin token."
    };
  }

  return { ok: true };
}
