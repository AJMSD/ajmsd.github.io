import { createHash, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { getEnv } from "@/lib/config/env";

export type AdminAuthFailure = {
  ok: false;
  status: 401 | 503;
  errorCode: "ADMIN_TOKEN_MISSING" | "UNAUTHORIZED";
  message: string;
  reason:
    | "missing_admin_token"
    | "missing_authorization_header"
    | "invalid_authorization_header"
    | "invalid_admin_token";
};

export type AdminAuthResult =
  | { ok: true }
  | AdminAuthFailure;

export function requireAdminAuthorization(request: NextRequest): AdminAuthResult {
  const env = getEnv();
  if (!env.adminToken) {
    return adminTokenMissingFailure();
  }

  const parsedToken = parseBearerToken(request.headers.get("authorization"));
  if (!parsedToken.ok) {
    return parsedToken.failure;
  }

  if (!isTokenMatch(parsedToken.token, env.adminToken)) {
    return unauthorizedFailure("Invalid admin token.", "invalid_admin_token");
  }

  return { ok: true };
}

export function verifyAdminAuthorization(request: NextRequest): AdminAuthResult {
  return requireAdminAuthorization(request);
}

function parseBearerToken(
  authorizationHeader: string | null
): { ok: true; token: string } | { ok: false; failure: AdminAuthFailure } {
  if (!authorizationHeader) {
    return {
      ok: false,
      failure: unauthorizedFailure(
        "Missing Authorization header.",
        "missing_authorization_header"
      )
    };
  }

  const parts = authorizationHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return {
      ok: false,
      failure: unauthorizedFailure(
        "Missing or invalid Authorization header.",
        "invalid_authorization_header"
      )
    };
  }

  return {
    ok: true,
    token: parts[1]
  };
}

function isTokenMatch(providedToken: string, expectedToken: string): boolean {
  const providedHash = createHash("sha256").update(providedToken).digest();
  const expectedHash = createHash("sha256").update(expectedToken).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

function adminTokenMissingFailure(): AdminAuthFailure {
  return {
    ok: false,
    status: 503,
    errorCode: "ADMIN_TOKEN_MISSING",
    message: "ADMIN_TOKEN is not configured on the server.",
    reason: "missing_admin_token"
  };
}

function unauthorizedFailure(
  message: string,
  reason:
    | "missing_authorization_header"
    | "invalid_authorization_header"
    | "invalid_admin_token"
): AdminAuthFailure {
  return {
    ok: false,
    status: 401,
    errorCode: "UNAUTHORIZED",
    message,
    reason
  };
}
