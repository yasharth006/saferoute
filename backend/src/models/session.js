const { createHash, randomBytes, randomUUID } = require('crypto'); const { getPool } = require('../config/db');
const hash = (value) => createHash('sha256').update(value).digest('hex');
async function issue() {
  const token = randomBytes(32).toString('hex'); const reporterRef = randomUUID();
  const result = await getPool().query(`INSERT INTO reporter_sessions (id, reporter_ref, token_hash, expires_at)
    VALUES ($1,$2,$3,NOW() + INTERVAL '90 days') RETURNING reporter_ref, expires_at`, [randomUUID(), reporterRef, hash(token)]);
  return { token, reporter_ref: result.rows[0].reporter_ref, expires_at: result.rows[0].expires_at };
}
async function find(token) {
  const result = await getPool().query('SELECT * FROM reporter_sessions WHERE token_hash = $1 AND expires_at > NOW()', [hash(token)]); return result.rows[0];
}
module.exports = { issue, find };
