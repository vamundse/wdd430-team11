// lib/actions.ts
'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

function sanitizeRedirectTarget(value: FormDataEntryValue | null) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/';
}

/* ---------------------------------- LOGIN --------------------------------- */

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = sanitizeRedirectTarget(formData.get('redirectTo'));

  try {
    await signIn('credentials', { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        default:
          return 'Something went wrong. Please try again.';
      }
    }
    // Re-throw so Next.js can handle the redirect after a successful login
    throw error;
  }
}

/* ---------------------------------- LOGOUT -------------------------------- */

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

/* --------------------------------- SIGN UP -------------------------------- */

const SignupSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters.'),
    email: z.string().trim().toLowerCase().email('Please enter a valid email.'),
    password: z.string().min(6, 'Password must have at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type SignupField = 'name' | 'email' | 'password' | 'confirmPassword';

export type SignupState =
  | {
      errors?: Partial<Record<SignupField, string>>;
      message?: string;
      values?: { name?: string; email?: string };
    }
  | undefined;

export async function register(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
  };

  // Values sent back so the form keeps what the user typed (never the password)
  const values = { name: raw.name, email: raw.email };

  // 1. Validate the fields
  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<SignupField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as SignupField;
      if (!errors[field]) errors[field] = issue.message;
    }
    return { errors, values };
  }

  const { name, email, password } = parsed.data;

  // 2. Save the user in MongoDB
  try {
    await connectToDatabase();

    const existing = await User.findOne({ email });
    if (existing) {
      return {
        errors: { email: 'An account with this email already exists.' },
        values,
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return {
        errors: { email: 'An account with this email already exists.' },
        values,
      };
    }
    console.error('Sign up error:', error);
    return { message: 'Something went wrong. Please try again.', values };
  }


  await signIn('credentials', { email, password, redirectTo: '/' });
}