import packageJson from "@/package.json";
import { getEnv, isPostgresConfigured } from "@/lib/config/env";
import { pingDb } from "@/lib/db/client";
import { embeddingsCount } from "@/lib/db/materialized-content";

export type HealthStatus = {
  build_version: string;
  db: {
    choice: "postgres" | "sqlite";
    configured: boolean;
    reachable: boolean;
  };
  embeddings_index: {
    status: "ready" | "degraded" | "not_configured";
    count: number;
  };
  overall_status: "ok" | "degraded";
  timestamp: string;
};

export async function getHealthStatus(): Promise<HealthStatus> {
  const env = getEnv();
  const configured = isPostgresConfigured();
  let reachable = false;
  let embeddingCount = 0;

  if (configured) {
    try {
      await pingDb();
      reachable = true;
      embeddingCount = await embeddingsCount();
    } catch {
      reachable = false;
      embeddingCount = 0;
    }
  }

  const embeddingsStatus = !configured ? "not_configured" : reachable ? "ready" : "degraded";
  const overallStatus = configured && !reachable ? "degraded" : "ok";

  return {
    build_version: env.buildVersion ?? packageJson.version ?? "unknown",
    db: {
      choice: env.dbChoice,
      configured,
      reachable
    },
    embeddings_index: {
      status: embeddingsStatus,
      count: embeddingCount
    },
    overall_status: overallStatus,
    timestamp: new Date().toISOString()
  };
}
