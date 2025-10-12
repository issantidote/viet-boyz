export function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected) return next();
  if (req.header('x-api-key') === expected) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}
