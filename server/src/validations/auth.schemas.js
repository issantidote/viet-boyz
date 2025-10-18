import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(100, 'Email must be 100 characters or less'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be 100 characters or less')
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
});

// Username: only letters, numbers, and underscores
export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[A-Za-z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

// Email: valid email format
export const emailSchema = z.string()
  .email('Email must be a valid email address');

// Password: at least 8 characters, at least one digit
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/\d/, 'Password must contain at least one digit');

// Registration schema
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
