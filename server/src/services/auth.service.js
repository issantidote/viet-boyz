import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const AUTH_FILE = 'users.data.json';
const users = new Map();

function loadUsersData() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
      const arr = JSON.parse(raw);
      for (const u of arr) users.set(u.email, u);
    }
  } catch (e) {
    console.error('Failed to load users data file:', e.message);
  }
}

function saveUsersData() {
  try {
    const arr = Array.from(users.values());
    fs.writeFileSync(AUTH_FILE, JSON.stringify(arr, null, 2));
  } catch (e) {
    console.error('Failed to save users data file:', e.message);
  }
}

loadUsersData();

export async function registerUser({ email, password }) {
  if (users.has(email)) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }
  const id = `u_${Date.now()}`;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id, email, passwordHash };
  users.set(email, user);
  saveUsersData();
  return sanitize(user);
}

export async function loginUser({ email, password }) {
  const user = users.get(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
  return { user: sanitize(user), token };
}

export function getUserByEmail(email) {
  const user = users.get(email);
  return user ? sanitize(user) : null;
}

export function getUserById(id) {
  for (const u of users.values()) if (u.id === id) return sanitize(u);
  return null;
}

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}


