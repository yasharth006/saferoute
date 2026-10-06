const { randomUUID } = require('crypto');
const { getPool } = require('../config/db');

const statuses = ['submitted', 'acknowledged', 'under_review', 'escalated', 'resolved', 'closed'];
async function create({ reporterRef, category, description, severity }) {
  const id = randomUUID();
  const trackingId = `SR-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
  const result = await getPool().query(
    `INSERT INTO complaints (id, tracking_id, reporter_ref, category, description, severity)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [id, trackingId, reporterRef, category, description, severity]
  );
  return result.rows[0];
}
async function findByTrackingId(trackingId) {
  const result = await getPool().query('SELECT * FROM complaints WHERE tracking_id = $1', [trackingId]);
  return result.rows[0];
}
async function findById(id) {
  const result = await getPool().query('SELECT * FROM complaints WHERE id = $1', [id]);
  return result.rows[0];
}
async function updateStatus(id, status, actor, note) {
  const db = getPool(); const client = await db.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT * FROM complaints WHERE id = $1 FOR UPDATE', [id]);
    if (!current.rows[0]) return null;
    const updated = await client.query('UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
    await client.query(`INSERT INTO status_logs (id, complaint_id, from_status, to_status, actor, note)
      VALUES ($1,$2,$3,$4,$5,$6)`, [randomUUID(), id, current.rows[0].status, status, actor, note || null]);
    await client.query('COMMIT'); return updated.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}
async function publicView(trackingId) {
  const complaint = await findByTrackingId(trackingId); if (!complaint) return null;
  const logs = await getPool().query('SELECT from_status, to_status, actor, timestamp, note FROM status_logs WHERE complaint_id = $1 ORDER BY timestamp ASC', [complaint.id]);
  return { id: complaint.id, tracking_id: complaint.tracking_id, category: complaint.category, severity: complaint.severity, status: complaint.status, created_at: complaint.created_at, updated_at: complaint.updated_at, status_logs: logs.rows };
}
module.exports = { statuses, create, findById, publicView, updateStatus };
