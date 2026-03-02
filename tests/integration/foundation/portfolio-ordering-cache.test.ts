import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getEducation } from "@/app/api/portfolio/education/route";
import { GET as getProjects } from "@/app/api/portfolio/projects/route";
import { GET as getWork } from "@/app/api/portfolio/work/route";

type TimelineRecord = {
  id: string;
  priority: number;
  start_date?: string;
};

type ListResponseBody = {
  data: TimelineRecord[];
  source: "db" | "file";
};

type EndpointCase = {
  name: string;
  url: string;
  handler: (request: NextRequest) => Promise<Response>;
};

const endpointCases: EndpointCase[] = [
  {
    name: "work",
    url: "http://localhost/api/portfolio/work",
    handler: getWork
  },
  {
    name: "projects",
    url: "http://localhost/api/portfolio/projects",
    handler: getProjects
  },
  {
    name: "education",
    url: "http://localhost/api/portfolio/education",
    handler: getEducation
  }
];

describe("M0.TST.02 portfolio ordering and cache behavior", () => {
  it("returns stable ordering by priority then date", async () => {
    for (const testCase of endpointCases) {
      const response = await testCase.handler(makeRequest(testCase.url));
      expect(response.status).toBe(200);

      const body = (await response.json()) as ListResponseBody;
      expect(body.source === "db" || body.source === "file").toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expectStableOrdering(body.data, testCase.name);
    }
  });

  it("returns ETag and serves 304 when If-None-Match matches", async () => {
    const firstResponse = await getProjects(makeRequest("http://localhost/api/portfolio/projects"));
    expect(firstResponse.status).toBe(200);

    const etag = firstResponse.headers.get("etag");
    const cacheControl = firstResponse.headers.get("cache-control");

    expect(etag).toBeTruthy();
    expect(cacheControl).toContain("s-maxage");

    const secondResponse = await getProjects(
      makeRequest("http://localhost/api/portfolio/projects", {
        "if-none-match": etag as string
      })
    );

    expect(secondResponse.status).toBe(304);
    expect(secondResponse.headers.get("etag")).toBe(etag);
    expect(secondResponse.headers.get("x-request-id")).toBeTruthy();
  });
});

function makeRequest(url: string, headers?: Record<string, string>): NextRequest {
  return new NextRequest(url, {
    method: "GET",
    headers
  });
}

function expectStableOrdering(records: TimelineRecord[], endpointName: string): void {
  for (let index = 1; index < records.length; index += 1) {
    const previous = records[index - 1];
    const current = records[index];

    const comparison = compareTimeline(previous, current);
    expect(
      comparison <= 0,
      `${endpointName} ordering violation at index ${index}: ${JSON.stringify(previous)} -> ${JSON.stringify(current)}`
    ).toBe(true);
  }
}

function compareTimeline(a: TimelineRecord, b: TimelineRecord): number {
  if (a.priority !== b.priority) {
    return a.priority - b.priority;
  }

  const leftDate = a.start_date ?? "";
  const rightDate = b.start_date ?? "";
  if (leftDate !== rightDate) {
    return rightDate.localeCompare(leftDate);
  }

  return a.id.localeCompare(b.id);
}
