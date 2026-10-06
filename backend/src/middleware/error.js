function notFound(req, res) { res.status(404).json({ error: 'Not found' }); }
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File exceeds the 10 MB limit' });
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Malformed JSON request body' });
  console.error(err); return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}
module.exports = { notFound, errorHandler };
