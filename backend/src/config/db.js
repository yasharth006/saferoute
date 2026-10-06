const { Pool } = require('pg');
const env = require('./env');

let pool;
function getPool() {
  if (!pool) {
    if (!env.databaseUrl) throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure it.');
    pool = new Pool({ connectionString: env.databaseUrl });
  }
  return pool;
}
function setPool(nextPool) { pool = nextPool; }
module.exports = { getPool, setPool };
