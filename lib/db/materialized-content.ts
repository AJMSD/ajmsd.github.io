import { DbClient, getDbPool } from "@/lib/db/client";
import { ensureMigrationsApplied } from "@/lib/db/migrate";

export const MATERIALIZED_KINDS = [
  "work",
  "projects",
  "education",
  "about",
  "lors",
  "story",
  "links",
  "game_question_bank"
] as const;

export type MaterializedKind = (typeof MATERIALIZED_KINDS)[number];

export type MaterializedRecordInput = {
  recordId: string;
  priority: number;
  startDate?: string;
  endDate?: string;
  payload: unknown;
};

export type MaterializedRecordRow = {
  record_id: string;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  payload: unknown;
};

export async function replaceKind(
  kind: MaterializedKind,
  records: MaterializedRecordInput[]
): Promise<void> {
  await ensureMigrationsApplied();
  const db = getDbPool();
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM materialized_content WHERE content_kind = $1", [kind]);

    for (const record of records) {
      await insertMaterializedRecord(client, kind, record);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listKind(kind: MaterializedKind): Promise<MaterializedRecordRow[]> {
  await ensureMigrationsApplied();

  const db = getDbPool();
  const result = await db.query<MaterializedRecordRow>(
    `
      SELECT record_id, priority, start_date, end_date, payload
      FROM materialized_content
      WHERE content_kind = $1
      ORDER BY priority ASC, start_date DESC NULLS LAST, record_id ASC
    `,
    [kind]
  );

  return result.rows;
}

export async function embeddingsCount(): Promise<number> {
  await ensureMigrationsApplied();

  const db = getDbPool();
  const result = await db.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM embeddings");
  return Number(result.rows[0]?.count ?? 0);
}

async function insertMaterializedRecord(
  client: DbClient,
  kind: MaterializedKind,
  record: MaterializedRecordInput
): Promise<void> {
  await client.query(
    `
      INSERT INTO materialized_content (content_kind, record_id, priority, start_date, end_date, payload, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())
      ON CONFLICT (content_kind, record_id)
      DO UPDATE
      SET priority = EXCLUDED.priority,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          payload = EXCLUDED.payload,
          updated_at = NOW()
    `,
    [
      kind,
      record.recordId,
      record.priority,
      record.startDate ?? null,
      record.endDate ?? null,
      JSON.stringify(record.payload)
    ]
  );
}
