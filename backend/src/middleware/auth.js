const jwt = require('jsonwebtoken'); const env = require('../config/env');
function requireAdmin(req, res, next) { const token = req.get('authorization')?.replace(/^Bearer\s+/i, ''); if (!token) return res.status(401).json({ error: 'Admin bearer token required' }); try { const payload = jwt.verify(token, env.jwtSecret); if (payload.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); req.user = payload; return next(); } catch { return res.status(401).json({ error: 'Invalid or expired token' }); } }
module.exports = { requireAdmin };
