// lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z, nativeEnum } from 'zod';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Subject } from '@/models/Subject';
import { requireUserId } from '@/lib/session';
import { isValidObjectId, startSession } from 'mongoose';
import { Task } from '@/models/Task';


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
// Every query is limited to the logged-in user's own subjects.
// All subject queries are limited to the logged-in user, so each student
// only sees their own subjects.
// requireUserId() must stay OUTSIDE try/catch: it redirects to /login by
// throwing, and a catch block would swallow that redirect.

export async function getSubjects( param: string | null ) {
  const userId = await requireUserId();

  try {
    await connectToDatabase();
    return await Subject.find({ userId, status: param ?? { $exists: true } });
  } catch (error: unknown) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

export async function getSubjectById(id: string) {
  const userId = await requireUserId();

  try {
    await connectToDatabase();
    return await Subject.findOne({ _id: id, userId });    
  } catch (error: unknown) {
    console.error('Error fetching subject by ID:', error);
    return null;
  }
}

export async function searchSubjects(query: string) {
  const userId = await requireUserId();
  try {
    await connectToDatabase();
    const subjects = await Subject.find({ userId,  name: { $regex: query, $options: 'i' } });
    return subjects;
  } catch (error: unknown) {
    console.error('Error searching subjects:', error);
    return [];
  }
}

export async function filterSubjectsByStatus(query: string) {
  const userId = await requireUserId();

  try {
    await connectToDatabase();
    const subjects = await Subject.find({ userId, status: query });
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

// Describes only what the form sends. The owner (userId) is NOT here on
// purpose: it comes from the session in createSubject, never from the form.

const subjectSchema = z.object({
  //userId: z.instanceof(Types.ObjectId), this will be set server-side, not from the form
  name: z
    .string({ error: "Subject name is required" })
    .min(3, { error: "Subject name cannot be empty" }), // ex: "Database Systems"
  code: z
    .string({ error: "Subject code is required" })
    .min(3, { error: "Subject code cannot be empty" }), // ex: "CS 340"
  instructor: z.string().optional(),
  color: z.string(), // hex, ex: "#2f5fe0"
  status: subjectStatus.optional(),
  progress: z.number().min(0).max(100).optional(), // 0-100
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export async function createSubject(formData: FormData) {
  // The owner comes from the session, so nobody can create subjects for another use
  const userId = await requireUserId(); 
  
  try {
    const rawData = {
      name: formData.get('name'),
      code: formData.get('code'),
      instructor: formData.get('instructor') || undefined,
      color: formData.get('color'),
      startDate: formData.get('startDate') || undefined,
      endDate: formData.get('endDate') || undefined,
    };

    console.log('Raw data:', rawData);

    const parsedData = subjectSchema.safeParse(rawData);
    console.log('Parsed data:', parsedData);

    await connectToDatabase();
    if (!parsedData.success) {
      console.error('Validation failed:', parsedData.error);
      return;//It failed: exit the function here.
    }

    const subject = await Subject.create({
      // No "return subject" here: returning would skip the revalidate + redirect below
      ...parsedData.data,
      userId,
    });
    console.log('Created subject:', subject);
    

  } catch (error: unknown) {
    console.error('Error creating subject:', error);
    return;
  }
  revalidatePath('/subjects');
}

export async function updateSubject(formData: FormData) {
  const id = formData.get('id') as string;
  
  try {
    const rawData = {
      name: formData.get('name'),
      code: formData.get('code'),
      instructor: formData.get('instructor') || undefined,
      color: formData.get('color'),
      startDate: formData.get('startDate') || undefined,
      endDate: formData.get('endDate') || undefined,
    };

    console.log('Raw data:', rawData);

    const parsedData = subjectSchema.safeParse(rawData);
    console.log('Parsed data:', parsedData);

    await connectToDatabase();
    if (!parsedData.success) {
      console.error('Validation failed:', parsedData.error);
      return;//It failed: exit the function here.
    }

    const subject = await Subject.updateOne(
      { _id: id },
      { $set: parsedData.data }
    );

    console.log('Updated subject:', subject);

  } catch (error: unknown) {
    console.error('Error updating subject:', error);
    return;
  }

  revalidatePath('/subjects');
  revalidatePath('/subjects/[id]', 'page');  
}

export async function deleteSubject(subjectId: string): Promise<void> {
  const userId = await requireUserId();
  if (!isValidObjectId(subjectId)) return;

  try {
    await connectToDatabase();
    const session = await startSession();

    try {
      await session.withTransaction(async () => {
        const result =await Subject.deleteOne(
          { _id: subjectId, userId },
          { session },
        );

        if (result.deletedCount === 0) {
          throw new Error('Failed to delete the subject. It may not exist or you may not have permission.');
        }

        await Task.deleteMany(
          { subjectId, userId },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('deleteSubject failed:', error);
    throw new Error('Failed to delete the subject. Please try again.');
  }

  revalidatePath('/subjects');
  revalidatePath('/tasks');
  revalidatePath('/subjects/[id]', 'page');
}