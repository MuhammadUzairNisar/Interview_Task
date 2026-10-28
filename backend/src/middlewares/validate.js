const ApiError = require('../utils/ApiError');

// Validates req[source] against a zod schema and stores the parsed result on req.validated[source].
const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(ApiError.badRequest('Validation failed', details));
  }
  req.validated = { ...req.validated, [source]: result.data };
  next();
};

module.exports = validate;
