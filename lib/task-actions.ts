'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { requireUserId } from '@/lib/session';
import { Task } from '@/models/Task';
import { Subject } from '@/models/Subject';

/* ------------------------------- Validation ------------------------------- */

const TaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title must have at most 120 characters.'),
  subjectId: z.string().regex(/^[a-f\d]{24}$/i, 'Please choose a subject.'),
  priority: z.enum(['low', 'medium', 'high'], { message: 'Please choose a priority.' }),
  status: z.enum(['pending', 'in_progress', 'completed'], {
    message: 'Please choose a status.',
  }),
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

function isValidId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

// Reads the raw text values from the form (used by create and update)
function readTaskForm(formData: FormData): TaskFormValues {
  return {
    title: String(formData.get('title') ?? ''),
    subjectId: String(formData.get('subjectId') ?? ''),
    priority: String(formData.get('priority') ?? 'medium'),
    // The create form has no status field, so new tasks start as pending
    status: String(formData.get('status') || 'pending'),
    dueDate: String(formData.get('dueDate') ?? ''),
    dueTime: String(formData.get('dueTime') || '23:59'),
  };
}

type TaskData = Omit<z.infer<typeof TaskFormSchema>, 'dueDate' | 'dueTime'> & {
  dueDate: Date;
};

type ValidationResult =
  | { ok: true; data: TaskData }
  | { ok: false; errorState: TaskFormState };

// Validates the values. Returns either the clean data or the error state.
function validateTaskForm(values: TaskFormValues): ValidationResult {
  const parsed = TaskFormSchema.safeParse(values);

  if (!parsed.success) {
    const errors: TaskFormState['errors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as TaskFormField;
      (errors[field] ??= []).push(issue.message);
    }
    return {
      ok: false,
      errorState: { errors, message: 'Please fix the highlighted fields.', values },
    };
  }

  const { dueDate, dueTime, ...rest } = parsed.data;

  // Saved as UTC and always displayed in UTC, so the user sees exactly what they typed.
  const due = new Date(`${dueDate}T${dueTime}:00Z`);
  if (Number.isNaN(due.getTime())) {
    return {
      ok: false,
      errorState: { errors: { dueDate: ['Please choose a valid date.'] }, values },
    };
  }

  return { ok: true, data: { ...rest, dueDate: due } };
}

/* --------------------------------- CREATE --------------------------------- */

export async function createTask(
  prevState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const userId = await requireUserId();

  const values = readTaskForm(formData);
  const result = validateTaskForm(values);
  if (!result.ok) return result.errorState;
  const data = result.data;

  try {
    await connectToDatabase();

    // The subject must belong to the logged-in user
    const ownsSubject = await Subject.exists({ _id: data.subjectId, userId });
    if (!ownsSubject) {
      return { errors: { subjectId: ['Please choose one of your subjects.'] }, values };
    }

    await Task.create({
      userId,
      subjectId: data.subjectId,
      title: data.title,
      priority: data.priority,
      dueDate: data.dueDate,
    });
  } catch (error) {
    console.error('createTask failed:', error);
    throw new Error('Failed to create the task. Please try again.');
  }

  revalidatePath('/tasks');
  return { success: true };
}

/* --------------------------------- UPDATE --------------------------------- */

// taskId is pre-filled with updateTask.bind(null, task.id)
export async function updateTask(
  taskId: string,
  prevState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const userId = await requireUserId();

  const values = readTaskForm(formData);

  if (!isValidId(taskId)) {
    return { message: 'Invalid task.', values };
  }

  const result = validateTaskForm(values);
  if (!result.ok) return result.errorState;
  const data = result.data;

  try {
    await connectToDatabase();

    const ownsSubject = await Subject.exists({ _id: data.subjectId, userId });
    if (!ownsSubject) {
      return { errors: { subjectId: ['Please choose one of your subjects.'] }, values };
    }

    // Only finds the task if it belongs to the logged-in user
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return { message: 'This task no longer exists.', values };
    }

    const wasDone = task.status === 'completed';
    const isDone = data.status === 'completed';

    task.title = data.title;
    task.subjectId = data.subjectId;
    task.priority = data.priority;
    task.dueDate = data.dueDate;
    task.status = data.status;
    // Keep the original completion date if it was already completed
    if (isDone && !wasDone) task.completedAt = new Date();
    if (!isDone) task.completedAt = undefined;

    await task.save();
  } catch (error) {
    console.error('updateTask failed:', error);
    throw new Error('Failed to update the task. Please try again.');
  }

  revalidatePath('/tasks');
  return { success: true };
}

/* --------------------------------- DELETE --------------------------------- */

export async function deleteTask(taskId: string): Promise<void> {
  const userId = await requireUserId();

  if (!isValidId(taskId)) return;

  try {
    await connectToDatabase();
    // The userId filter makes sure nobody deletes another user's task
    await Task.deleteOne({ _id: taskId, userId });
  } catch (error) {
    console.error('deleteTask failed:', error);
    throw new Error('Failed to delete the task. Please try again.');
  }

  revalidatePath('/tasks');
}

/* ------------------------- MARK AS COMPLETED (TOGGLE) ------------------------- */

export async function toggleTaskCompleted(taskId: string): Promise<void> {
  const userId = await requireUserId();

  if (!isValidId(taskId)) return;

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
