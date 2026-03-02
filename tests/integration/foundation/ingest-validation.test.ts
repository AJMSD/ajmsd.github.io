import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_ADMIN_TOKEN = "test-admin-token-for-m0-tst-02";

describe("M0.TST.02 ingest validation integration", () => {
  const originalAdminToken = process.env.ADMIN_TOKEN;

  beforeEach(() => {
    vi.resetModules();
    process.env.ADMIN_TOKEN = TEST_ADMIN_TOKEN;
  });

  afterEach(() => {
    if (originalAdminToken === undefined) {
      delete process.env.ADMIN_TOKEN;
    } else {
      process.env.ADMIN_TOKEN = originalAdminToken;
    }
    vi.resetModules();
  });

  it("rejects invalid payloads with structured error envelope", async () => {
    const { POST } = await import("@/app/api/admin/ingest/route");

    const request = new NextRequest("http://localhost/api/admin/ingest", {
      method: "POST",
      headers: {
        authorization: `Bearer ${TEST_ADMIN_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        source: "payload",
        payload: {}
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const body = (await response.json()) as {
      error_code: string;
      message: string;
      request_id: string;
    };

    expect(body.error_code).toBe("INVALID_INGEST_PAYLOAD");
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.request_id.length).toBeGreaterThan(0);
    expect(response.headers.get("x-request-id")).toBe(body.request_id);
  });
});
