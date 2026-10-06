const { randomUUID } = require('crypto'); const { getPool } = require('../config/db');
async function create({ complaintId, fileUrl, fileType, sha256Hash }) {
  const result = await getPool().query(`INSERT INTO evidence (id, complaint_id, file_url, file_type, sha256_hash)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`, [randomUUID(), complaintId, fileUrl, fileType, sha256Hash]);
  return result.rows[0];
}
async function findByIdForComplaint(id, complaintId) {
  const result = await getPool().query('SELECT * FROM evidence WHERE id = $1 AND complaint_id = $2', [id, complaintId]); return result.rows[0];
}
module.exports = { create, findByIdForComplaint };
