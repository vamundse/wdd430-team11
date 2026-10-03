// lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { nativeEnum, z } from 'zod';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Subject } from '@/models/Subject';
import { Types } from 'mongoose';

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

/* --------------------------------- Subject Actions --------------------------------- */

export async function getSubjects() {
  try {
    await connectToDatabase();
    const subjects = await Subject.find();
    return subjects;
  } catch (error: unknown) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

export async function getSubjectById(id: string) {
  try {
    await connectToDatabase();
    const subject = await Subject.findById(id);
    return subject;
  } catch (error: unknown) {
    console.error('Error fetching subject by ID:', error);
    return null;
  }
}

export async function searchSubjects(query: string) {
  try {
    await connectToDatabase();
    const subjects = await Subject.find({ name: { $regex: query, $options: 'i' } });
    return subjects;
  } catch (error: unknown) {
    console.error('Error searching subjects:', error);
    return [];
  }
}

export async function filterSubjectsByStatus(query: string) {
  try {
    await connectToDatabase();
    const subjects = await Subject.find({ status: query });
    return subjects;
  } catch (error: unknown) {
    console.error('Error filtering subjects:', error);
    return [];
  }
}

const subjectStatus = z.nativeEnum({
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
});

const createSubjectSchema = z.object({
  userId: z.instanceof(Types.ObjectId),
  name: z.string(), // ex: "Database Systems"
  code: z.string(), // ex: "CS 340"
  instructor: z.string().optional(),
  color: z.string(), // hex, ex: "#2f5fe0"
  status: subjectStatus.optional(),
  progress: z.number().min(0).max(100).optional(), // 0-100
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export async function createSubject(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      code: formData.get('code'),
      instructor: formData.get('instructor') || undefined,
      color: formData.get('color'),
      startDate: formData.get('startDate') || undefined,
    };

    console.log('Raw data:', rawData);

    const parsedData = createSubjectSchema.safeParse(rawData);
    console.log('Parsed data:', parsedData);

    await connectToDatabase();
    if (!parsedData.success) {
      console.error('Validation failed:', parsedData.error);
      return null;
    }

    const subject = await Subject.create(parsedData.data);
    console.log('Created subject:', subject);
    return subject;

  } catch (error: unknown) {
    console.error('Error creating subject:', error);
    return null;
  }

  revalidatePath('/subjects');  
  redirect('/subjects');
}