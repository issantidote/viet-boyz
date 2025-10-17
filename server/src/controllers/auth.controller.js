const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = []; // Replace with DB in production

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
};