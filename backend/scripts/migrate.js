const fs = require('fs/promises'); const path = require('path'); const { getPool } = require('../src/config/db');
(async () => { const sql = await fs.readFile(path.join(__dirname, '../migrations/001_initial.sql'), 'utf8'); await getPool().query(sql); console.log('Migration complete.'); await getPool().end(); })().catch((error) => { console.error(error); process.exitCode = 1; });
