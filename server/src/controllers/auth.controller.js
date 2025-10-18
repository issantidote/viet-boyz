import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory store (will be replaced with DB in Assignment 4)
const users = new Map();

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.set(email, user);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

export const _users = users;