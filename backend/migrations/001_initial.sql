CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role = 'admin'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reporter_sessions (
  id UUID PRIMARY KEY,
  reporter_ref UUID UNIQUE NOT NULL,
  token_hash CHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY,
  tracking_id VARCHAR(32) UNIQUE NOT NULL,
  reporter_ref UUID NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'acknowledged', 'under_review', 'escalated', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY,
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(255) NOT NULL,
  sha256_hash CHAR(64) NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_logs (
  id UUID PRIMARY KEY,
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  from_status VARCHAR(30),
  to_status VARCHAR(30) NOT NULL,
  actor VARCHAR(120) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_evidence_complaint_id ON evidence(complaint_id);
CREATE INDEX IF NOT EXISTS idx_status_logs_complaint_id ON status_logs(complaint_id);
