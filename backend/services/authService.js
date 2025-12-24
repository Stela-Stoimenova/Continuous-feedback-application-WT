/**
 * Auth Service
 * Handles signup and login: creates users, verifies credentials, and issues JWTs.
 * Security: stores `password_hash` (bcrypt), signs tokens with `JWT_SECRET`, includes `role` in JWT.
 */
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

module.exports = {
  /**
   * Sign up a new user (defaults to role 'PROFESSOR').
   * Params: { email, name, password }
   * Throws: Error if user already exists.
   * Returns: { token, user }.
   */
  async signUp({ email, name, password }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, name, password_hash, role: 'PROFESSOR' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return { token, user };
  },

  /**
   * Log in an existing user.
   * Params: { email, password }
   * Throws: Error on invalid email or password.
   * Returns: { token, user }.
   */
  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return { token, user };
  }
};
