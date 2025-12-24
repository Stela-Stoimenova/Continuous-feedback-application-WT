/**
 * Global Error Handler Middleware
 * Logs the error and responds with a JSON payload.
 * Use by `app.use(require('./middleware/errorHandler'))` as the last middleware.
 */
module.exports = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};
