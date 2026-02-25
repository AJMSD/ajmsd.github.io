CREATE TABLE IF NOT EXISTS materialized_content (
  content_kind TEXT NOT NULL,
  record_id TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (content_kind, record_id)
);

CREATE INDEX IF NOT EXISTS idx_materialized_content_kind
  ON materialized_content (content_kind);

CREATE INDEX IF NOT EXISTS idx_materialized_content_ordering
  ON materialized_content (content_kind, priority, start_date, record_id);

CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS embeddings (
  id BIGSERIAL PRIMARY KEY,
  source_id TEXT NOT NULL UNIQUE,
  embedding JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embeddings_source_id
  ON embeddings (source_id);

CREATE TABLE IF NOT EXISTS chat_cache (
  cache_key TEXT PRIMARY KEY,
  session_id TEXT,
  query_text TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_cache_expires_at
  ON chat_cache (expires_at);
