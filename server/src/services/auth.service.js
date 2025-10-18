import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const AUTH_FILE = 'users.data.json';
const users = new Map();

// Load users from file on startup
function loadUsersData() {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(user => users.set(user.email, user));
        console.log(`Loaded ${data.length} users from file`);
      }
    } catch (e) {
      console.warn('Failed to load users data file:', e.message);
    }
  }
}

// Save users to file
async function saveUsersData() {
  try {
    const data = Array.from(users.values());
    await fs.promises.writeFile(AUTH_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save users data:', e.message);
  }
}

loadUsersData();

export async function registerUser({ email, password }) {
  if (users.has(email)) {
    throw new Error('Email already exists');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  users.set(email, user);
  await saveUsersData();
  
  return { id: user.id, email: user.email };
}

export async function loginUser({ email, password }) {
  const user = users.get(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
  
  return { 
    user: { id: user.id, email: user.email },
    token 
  };
}

export function getUserByEmail(email) {
  return users.get(email) || null;
}

export function getUserById(id) {
  return Array.from(users.values()).find(u => u.id === id) || null;
}