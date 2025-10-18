import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// User data storage
const USERS_FILE = 'users.data.json';
const usersMap = new Map();

// Load user data from file on startup
function loadUserData() {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(item => usersMap.set(item.email, item));
        console.log(`Loaded ${data.length} users from file`);
      }
    } catch (e) {
      console.warn('Failed to load users data file:', e.message);
    }
  }
}

// Save user data to file
async function saveUserData() {
  try {
    const data = Array.from(usersMap.values());
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save user data:', e.message);
  }
}

// Load data on module initialization
loadUserData();

// User store wrapper
const userStore = {
  getAll() {
    return Array.from(usersMap.values());
  },
  get(email) {
    return usersMap.get(email) || null;
  },
  set(email, item) {
    usersMap.set(email, item);
  },
  delete(email) {
    return usersMap.delete(email);
  }
};

// Service: Register a new user
export async function register({ username, email, password }) {
  if (userStore.get(email)) {
    throw new Error('Email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuid(), username, email, password: hashedPassword };
  userStore.set(email, user);
  await saveUserData();
  return { id: user.id, username: user.username, email: user.email };
}

// Service: Login user and return JWT
export async function login({ email, password }) {
  const user = userStore.get(email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ email: user.email, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

// Service: Get user by email
export function getUserByEmail(email) {
  return userStore.get(email);
}

// Service: List all users
export function listUsers() {
  return userStore.getAll().map(u => ({ id: u.id, username: u.username, email: u.email }));
}

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