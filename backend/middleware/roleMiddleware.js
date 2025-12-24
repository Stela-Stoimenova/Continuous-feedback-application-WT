/**
 * Role Authorization Middleware
 * Ensures `req.user.role` is one of the allowed roles.
 * Assumes `authMiddleware` has already set `req.user` from a valid JWT.
 */
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};
