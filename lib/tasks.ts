import type { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Task, type TaskPriority, type TaskStatus } from '@/models/Task';
import { Subject } from '@/models/Subject';

// Plain objects that can be passed from Server to Client Components.
export type TaskListItem = {
  id: string;
  title: string;
  subjectId: string; // used to pre-select the subject in the edit form
  subjectLabel: string;
  dueDate: string; // ISO string
  status: TaskStatus;
  priority: TaskPriority;
  isOverdue: boolean;
};

export type SubjectOption = {
  id: string;
  label: string; // ex: "CS 340 - Database Systems"
};

type SubjectDoc = { _id: Types.ObjectId; name: string; code: string };

type TaskDoc = {
  _id: Types.ObjectId;
  title: string;
  subjectId: SubjectDoc | null; // populated
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
};

function subjectLabel(subject: SubjectDoc) {
  return `${subject.code} - ${subject.name}`;
}

export async function getTasksForUser(userId: string): Promise<TaskListItem[]> {
  await connectToDatabase();
  const now = new Date();

  const tasks = await Task.find({ userId })
    .populate('subjectId', 'name code')
    .sort({ dueDate: 1 })
    .lean<TaskDoc[]>();

  return tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    subjectId: task.subjectId ? task.subjectId._id.toString() : '',
    subjectLabel: task.subjectId ? subjectLabel(task.subjectId) : 'No subject',
    dueDate: task.dueDate.toISOString(),
    status: task.status,
    priority: task.priority,
    isOverdue: task.status !== 'completed' && task.dueDate < now,
  }));
}

export async function getSubjectOptions(userId: string): Promise<SubjectOption[]> {
  await connectToDatabase();

  const subjects = await Subject.find({ userId })
    .select('name code')
    .sort({ code: 1 })
    .lean<SubjectDoc[]>();

  return subjects.map((subject) => ({
    id: subject._id.toString(),
    label: subjectLabel(subject),
  }));
}

// Progress per subject: completed tasks ÷ total tasks, as a number from 0 to 100.
// Returns an object like { "<subjectId>": 50, "<otherSubjectId>": 100 }
export async function getProgressBySubject(userId: string): Promise<Record<string, number>> {
  await connectToDatabase();

  const tasks = await Task.find({ userId })
    .select('subjectId status')
    .lean<{ subjectId: Types.ObjectId; status: TaskStatus }[]>();

  // 1. Count total and completed tasks for each subject
  const counts: Record<string, { done: number; total: number }> = {};
  for (const task of tasks) {
    const subjectId = task.subjectId.toString();
    const entry = (counts[subjectId] ??= { done: 0, total: 0 });
    entry.total += 1;
    if (task.status === 'completed') entry.done += 1;
  }

  // 2. Turn the counts into percentages
  const progress: Record<string, number> = {};
  for (const [subjectId, { done, total }] of Object.entries(counts)) {
    progress[subjectId] = Math.round((done / total) * 100);
  }
  return progress;
}