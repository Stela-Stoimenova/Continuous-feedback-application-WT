/**
 * Auth Controller
 * Maps HTTP requests to `authService` for signup/login.
 * Does not store sessions; returns JWT and public user fields.
 */
const authService = require('../services/authService');

module.exports = {
  /**
   * Sign up a new professor account.
   * Body: { email, name, password }
   * Returns: 201 with { token, user } or 400 on validation/conflict.
   */
  async signUp(req, res) {
    try {
      const { email, name, password } = req.body;
      const { token, user } = await authService.signUp({ email, name, password });

      return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  /**
   * Log in an existing account.
   * Body: { email, password }
   * Returns: 200 with { token, user } or 400 on invalid credentials.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login({ email, password });

      return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};
