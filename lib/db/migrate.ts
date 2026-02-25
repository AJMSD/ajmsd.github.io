import { readFile, readdir } from "fs/promises";
import path from "path";
import { DbClient, getDbPool } from "@/lib/db/client";

const MIGRATIONS_DIR = path.join(process.cwd(), "lib", "db", "migrations");
let migrationPromise: Promise<void> | null = null;

export async function ensureMigrationsApplied(): Promise<void> {
  if (migrationPromise) {
    return migrationPromise;
  }

  migrationPromise = applyMigrations().catch((error) => {
    migrationPromise = null;
    throw error;
  });

  return migrationPromise;
}

async function applyMigrations(): Promise<void> {
  const db = getDbPool();
  const client = await db.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const entries = await readdir(MIGRATIONS_DIR);
    const migrationFiles = entries.filter((entry) => entry.endsWith(".sql")).sort();

    for (const fileName of migrationFiles) {
      const alreadyApplied = await isMigrationApplied(client, fileName);
      if (alreadyApplied) {
        continue;
      }

      const migrationPath = path.join(MIGRATIONS_DIR, fileName);
      const migrationSql = await readFile(migrationPath, "utf8");

      await client.query("BEGIN");
      try {
        await client.query(migrationSql);
        await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [fileName]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    client.release();
  }
}

async function isMigrationApplied(client: DbClient, migrationId: string): Promise<boolean> {
  const result = await client.query<{ exists: boolean }>(
    "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE id = $1) AS exists",
    [migrationId]
  );

  return Boolean(result.rows[0]?.exists);
}
