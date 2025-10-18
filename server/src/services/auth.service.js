const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Replace with a real database in production
const users = [];

const registerUser = async ({ username, email, password }) => {
  if (users.find(u => u.email === email)) {
    throw new Error('Email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, email, password: hashedPassword };
  users.push(user);
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};