import { z } from "zod";

const EnvSchema = z.object({
  DB_CHOICE: z.enum(["postgres", "sqlite"]).default("postgres"),
  DATABASE_URL: z.string().min(1).optional(),
  ADMIN_TOKEN: z.string().min(1).optional(),
  BUILD_VERSION: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export type AppEnv = {
  dbChoice: "postgres" | "sqlite";
  databaseUrl?: string;
  adminToken?: string;
  buildVersion?: string;
  nodeEnv: "development" | "test" | "production";
};

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = EnvSchema.parse(process.env);

  cachedEnv = {
    dbChoice: parsed.DB_CHOICE,
    databaseUrl: parsed.DATABASE_URL,
    adminToken: parsed.ADMIN_TOKEN,
    buildVersion: parsed.BUILD_VERSION,
    nodeEnv: parsed.NODE_ENV
  };

  return cachedEnv;
}

export function isPostgresConfigured(): boolean {
  const env = getEnv();
  return env.dbChoice === "postgres" && Boolean(env.databaseUrl);
}
