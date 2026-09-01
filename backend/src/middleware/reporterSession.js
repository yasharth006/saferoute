const sessions = require('../models/session');
async function requireReporterSession(req, res, next) { const token = req.get('x-reporter-session'); if (!token) return res.status(401).json({ error: 'x-reporter-session header required' }); const session = await sessions.find(token); if (!session) return res.status(401).json({ error: 'Invalid or expired reporter session' }); req.reporterSession = session; next(); }
module.exports = { requireReporterSession };
