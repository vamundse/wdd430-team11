import type { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Task, type TaskPriority, type TaskStatus } from '@/models/Task';
import { Subject } from '@/models/Subject';

// Plain objects that can be passed from Server to Client Components.
export type TaskListItem = {
  id: string;
  title: string;
  subjectLabel: string;
  dueDate: string; // ISO string
  status: TaskStatus;
  priority: TaskPriority;
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

  const tasks = await Task.find({ userId })
    .populate('subjectId', 'name code')
    .sort({ dueDate: 1 })
    .lean<TaskDoc[]>();

  return tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    subjectLabel: task.subjectId ? subjectLabel(task.subjectId) : 'No subject',
    dueDate: task.dueDate.toISOString(),
    status: task.status,
    priority: task.priority,
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
