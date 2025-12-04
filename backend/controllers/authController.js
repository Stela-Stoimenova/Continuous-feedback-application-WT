const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

module.exports = {
  async signUp(req, res) {
    try {
      const { email, name, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.create({ email, name, password_hash, role: 'PROFESSOR' });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: 'Invalid email' });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
