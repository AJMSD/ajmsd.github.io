import { getEnv } from "@/lib/config/env";

export type DbRow = Record<string, unknown>;

export type DbQueryResult<TRow extends DbRow = DbRow> = {
  rows: TRow[];
  rowCount: number | null;
};

export type DbClient = {
  query<TRow extends DbRow = DbRow>(text: string, values?: unknown[]): Promise<DbQueryResult<TRow>>;
  release(): void;
};

export type DbPool = {
  query<TRow extends DbRow = DbRow>(text: string, values?: unknown[]): Promise<DbQueryResult<TRow>>;
  connect(): Promise<DbClient>;
};

const { Pool } = require("pg") as {
  Pool: new (config: { connectionString: string }) => DbPool;
};

let pool: DbPool | null = null;

export function getDbPool(): DbPool {
  if (pool) {
    return pool;
  }

  const env = getEnv();
  if (env.dbChoice !== "postgres") {
    throw new Error(`Unsupported DB_CHOICE '${env.dbChoice}'. This phase supports postgres only.`);
  }
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required when DB_CHOICE is postgres.");
  }

  pool = new Pool({
    connectionString: env.databaseUrl
  });

  return pool;
}

export async function queryDb<TRow extends DbRow = DbRow>(
  text: string,
  values: unknown[] = []
): Promise<DbQueryResult<TRow>> {
  const db = getDbPool();
  return db.query<TRow>(text, values);
}

export async function pingDb(): Promise<boolean> {
  await queryDb("SELECT 1");
  return true;
}
