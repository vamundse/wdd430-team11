'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { requireUserId } from '@/lib/session';
import { Task } from '@/models/Task';
import { Subject } from '@/models/Subject';

const TaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title must have at most 120 characters.'),
  subjectId: z.string().regex(/^[a-f\d]{24}$/i, 'Please choose a subject.'),
  priority: z.enum(['low', 'medium', 'high'], { message: 'Please choose a priority.' }),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a due date.'),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time.'),
});

type TaskFormField = keyof z.infer<typeof TaskFormSchema>;

export type TaskFormValues = Record<TaskFormField, string>;

export type TaskFormState = {
  success?: boolean;
  errors?: Partial<Record<TaskFormField, string[]>>;
  message?: string | null;
  values?: TaskFormValues; // what the user typed, shown again after an error
};

export async function createTask(
  prevState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const userId = await requireUserId();

  const values: TaskFormValues = {
    title: String(formData.get('title') ?? ''),
    subjectId: String(formData.get('subjectId') ?? ''),
    priority: String(formData.get('priority') ?? 'medium'),
    dueDate: String(formData.get('dueDate') ?? ''),
    dueTime: String(formData.get('dueTime') || '23:59'),
  };

  // 1. Validate the fields
  const parsed = TaskFormSchema.safeParse(values);

  if (!parsed.success) {
    const errors: TaskFormState['errors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as TaskFormField;
      (errors[field] ??= []).push(issue.message);
    }
    return { errors, message: 'Please fix the highlighted fields.', values };
  }

  const { title, subjectId, priority, dueDate, dueTime } = parsed.data;

  // Saved as UTC and always displayed in UTC, so the user sees exactly what they typed.
  const due = new Date(`${dueDate}T${dueTime}:00Z`);
  if (Number.isNaN(due.getTime())) {
    return { errors: { dueDate: ['Please choose a valid date.'] }, values };
  }

  // 2. Save the task in MongoDB
  try {
    await connectToDatabase();

    // The subject must belong to the logged-in user
    const ownsSubject = await Subject.exists({ _id: subjectId, userId });
    if (!ownsSubject) {
      return { errors: { subjectId: ['Please choose one of your subjects.'] }, values };
    }

    await Task.create({ userId, subjectId, title, priority, dueDate: due });
  } catch (error) {
    console.error('createTask failed:', error);
    throw new Error('Failed to create the task. Please try again.');
  }

  // 3. Refresh the list
  revalidatePath('/tasks');
  return { success: true };
}

export async function toggleTaskCompleted(taskId: string): Promise<void> {
  const userId = await requireUserId();

  // Ignore anything that isn't a valid MongoDB id
  if (!/^[a-f\d]{24}$/i.test(taskId)) return;

  try {
    await connectToDatabase();

    // Only finds the task if it belongs to the logged-in user
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) return;

    const isDone = task.status === 'completed';
    task.status = isDone ? 'pending' : 'completed';
    task.completedAt = isDone ? undefined : new Date();
    await task.save();
  } catch (error) {
    console.error('toggleTaskCompleted failed:', error);
    throw new Error('Failed to update the task. Please try again.');
  }

  revalidatePath('/tasks');
}