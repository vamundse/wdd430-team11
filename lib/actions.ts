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
  name: z
    .string({ error: "Subject name is required" })
    .trim()
    .min(3, { error: "Subject name must be at least 3 characters long" }),
  code: z
    .string({ error: "Subject code is required" })
    .trim()
    .min(3, { error: "Subject code must be at least 3 characters long" }),
  instructor: z
    .string()
    .trim()
    .min(3, { error: "Instructor name must be at least 3 characters long" })
    .optional(),
  color: z
    .string(),
  status: subjectStatus.optional(),
  progress: z
  .number({ error: "Progress must be a number" })
  .min(0, { error: "Progress cannot be less than 0" })
  .max(100, { error: "Progress cannot be greater than 100" })
  .optional(),
  startDate: z
    .coerce.date({ error: "Start date must be a valid date" })
    .optional(),
  endDate: z
    .coerce.date({ error: "End date must be a valid date" })
    .optional(),
  notes: z
  .string()
  .max(500, { error: "Notes cannot be longer than 500 characters" })
  .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

type SubjectFormField =
  | 'name'
  | 'code'
  | 'instructor'
  | 'color'
  | 'startDate'
  | 'endDate';

export type SubjectFormState = {
  errors?: Partial<Record<SubjectFormField, string[]>>;
  message?: string;
  rawData?: Record<SubjectFormField, string>;
}

export async function createSubject(
  prevState: SubjectFormState,
  formData: FormData,
) : Promise<SubjectFormState> {
  const userId = await requireUserId(); 
  
  const rawData: Record<SubjectFormField, string> = {
    name: String(formData.get('name') ?? ''),
    code: String(formData.get('code') ?? ''),
    instructor: String(formData.get('instructor') ?? ''),
    color: String(formData.get('color') ?? ''),
    startDate: String(formData.get('startDate') ?? ''),
    endDate: String(formData.get('endDate') ?? ''),
  };

  const parsedData = subjectSchema.safeParse({
    ...rawData,
    instructor: rawData.instructor || undefined,
    startDate: rawData.startDate || undefined,
    endDate: rawData.endDate || undefined,
  });
 
  if (!parsedData.success) {
    return {
      errors: z.flattenError(parsedData.error).fieldErrors,
      message: "Please fix the highlighted fields",
      rawData,
    };
  }

  try {  
    await connectToDatabase();
    const subject = await Subject.create({
      ...parsedData.data,
      userId,
    });

  } catch (error: unknown) {
    console.error('Error creating subject:', error);
    return {
      message: "Failed to create subject. Please try again.",
      rawData,
    }
  }
  revalidatePath('/subjects');
  return { message: "Subject created successfully" };
}

export async function updateSubject(
  prevState: SubjectFormState,
  formData: FormData,
) : Promise<SubjectFormState> {
  const id = formData.get('id') as string;
  
  const rawData: Record<SubjectFormField, string> = {
    name: String(formData.get('name') ?? ''),
    code: String(formData.get('code') ?? ''),
    instructor: String(formData.get('instructor') ?? ''),
    color: String(formData.get('color') ?? ''),
    startDate: String(formData.get('startDate') ?? ''),
    endDate: String(formData.get('endDate') ?? ''),
  };

  const parsedData = subjectSchema.safeParse({
    ...rawData,
    instructor: rawData.instructor || undefined,
    startDate: rawData.startDate || undefined,
    endDate: rawData.endDate || undefined,
  });
    
  if (!parsedData.success) {
    return {
      errors: z.flattenError(parsedData.error).fieldErrors,
      message: "Please fix the highlighted fields",
      rawData,
    };
  }
  try {
    await connectToDatabase();
    const subject = await Subject.updateOne(
      { _id: id },
      { $set: parsedData.data },
    );

  } catch (error: unknown) {
    console.error('Error creating subject:', error);
    return {
      message: "Failed to create subject. Please try again.",
      rawData,
    }
  }

  revalidatePath('/subjects');
  revalidatePath('/subjects/[id]', 'page');
  return { message: "Subject created successfully" };
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