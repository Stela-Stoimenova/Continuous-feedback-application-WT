const authService = require('../services/authService');

module.exports = {
  async signUp(req, res) {
    try {
      const { email, name, password } = req.body;
      const { token, user } = await authService.signUp({ email, name, password });

      return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

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
