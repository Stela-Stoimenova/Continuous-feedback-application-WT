//Runs an array of `express-validator` checks and returns 400 with errors if any fail.

const { validationResult } = require('express-validator');

module.exports = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(v => v.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(400).json({ errors: errors.array() });
  };
};
