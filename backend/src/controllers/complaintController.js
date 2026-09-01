const fs = require('fs/promises'); const path = require('path'); const { createHash } = require('crypto'); const { z } = require('zod');
const Complaint = require('../models/complaint'); const Evidence = require('../models/evidence'); const env = require('../config/env');
const createSchema = z.object({ category: z.string().trim().min(2).max(100), description: z.string().trim().min(10).max(5000), severity: z.enum(['low', 'medium', 'high', 'critical']) });
const statusSchema = z.object({ status: z.enum(Complaint.statuses), note: z.string().trim().max(1000).optional() });
const uuid = z.string().uuid();
const sha256File = async (file) => createHash('sha256').update(await fs.readFile(file)).digest('hex');
async function create(req, res) { const data = createSchema.parse(req.body); const complaint = await Complaint.create({ ...data, reporterRef: req.reporterSession.reporter_ref }); res.status(201).json({ id: complaint.id, tracking_id: complaint.tracking_id, status: complaint.status, created_at: complaint.created_at }); }
async function lookup(req, res) { const complaint = await Complaint.publicView(req.params.trackingId); if (!complaint) return res.status(404).json({ error: 'Complaint not found' }); res.json(complaint); }
async function uploadEvidence(req, res) {
  const complaintId = uuid.parse(req.params.id); const complaint = await Complaint.findById(complaintId); if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  if (!req.file) return res.status(400).json({ error: 'A file is required in the evidence field' });
  const hash = await sha256File(req.file.path); const evidence = await Evidence.create({ complaintId: complaint.id, fileUrl: req.file.path, fileType: req.file.mimetype || 'application/octet-stream', sha256Hash: hash });
  res.status(201).json({ id: evidence.id, complaint_id: evidence.complaint_id, file_type: evidence.file_type, sha256_hash: evidence.sha256_hash, uploaded_at: evidence.uploaded_at });
}
async function verifyEvidence(req, res) {
  const complaintId = uuid.parse(req.params.id); const evidenceId = uuid.parse(req.params.evidenceId); const evidence = await Evidence.findByIdForComplaint(evidenceId, complaintId); if (!evidence) return res.status(404).json({ error: 'Evidence not found' });
  try { const actual = await sha256File(path.resolve(evidence.file_url)); res.json({ evidence_id: evidence.id, valid: actual === evidence.sha256_hash, recorded_hash: evidence.sha256_hash, computed_hash: actual }); }
  catch (error) { if (error.code === 'ENOENT') return res.status(410).json({ error: 'Stored evidence file is missing', valid: false }); throw error; }
}
async function updateStatus(req, res) { const complaintId = uuid.parse(req.params.id); const data = statusSchema.parse(req.body); const complaint = await Complaint.updateStatus(complaintId, data.status, req.user.username, data.note); if (!complaint) return res.status(404).json({ error: 'Complaint not found' }); res.json(complaint); }
module.exports = { create, lookup, uploadEvidence, verifyEvidence, updateStatus };
