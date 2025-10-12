export const validate = (schema, from = 'body') => (req, res, next) => {
  // never pass the live object directly to zod; clone it
  const input = from === 'query' ? { ...req.query } : req[from];

  const result = schema.safeParse(input);
  if (!result.success) {
    console.error('Validation error on', from, {
      input,
      issues: result.error.issues
    });
    return res.status(400).json({
      error: 'Validation error',
      details: result.error.issues
    });
  }

  // ✅ Do not assign to req.query; attach parsed data elsewhere
  if (from === 'query') {
    req.validatedQuery = result.data;
  } else {
    req.body = result.data;      // reassigning req.body is fine
  }

  next();
};
