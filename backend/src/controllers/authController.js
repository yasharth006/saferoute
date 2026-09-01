const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken'); const env = require('../config/env'); const sessions = require('../models/session');
async function issueReporterSession(req, res) { const session = await sessions.issue(); res.status(201).json(session); }
async function adminLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  const valid = username === env.adminUsername && await bcrypt.compare(password, await bcrypt.hash(env.adminPassword, 10));
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: 'configured-admin', username, role: 'admin' }, env.jwtSecret, { expiresIn: '8h' });
  return res.json({ token, token_type: 'Bearer', expires_in: 28800 });
}
module.exports = { issueReporterSession, adminLogin };
