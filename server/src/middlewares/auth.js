export function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected) return next();
  if (req.header('x-api-key') === expected) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Middleware to extract user information from request
export function extractUser(req, res, next) {
  // For now, we'll use a simple approach:
  // 1. Check for user ID in query params (?userId=123)
  // 2. Check for user ID in headers (x-user-id)
  // 3. Default to a test user for development
  
  const userIdFromQuery = req.query.userId;
  const userIdFromHeader = req.header('x-user-id');
  const userIdFromBody = req.body?.userId;
  
  // Priority: header > query > body > default
  req.user = {
    id: userIdFromHeader || userIdFromQuery || userIdFromBody || 'default-user',
    // In a real app, you'd decode a JWT token or lookup user session here
  };
  
  next();
}
