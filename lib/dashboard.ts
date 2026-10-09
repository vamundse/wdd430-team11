import type { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Task, type TaskStatus } from '@/models/Task';
import { Event, type EventType } from '@/models/Event';
import { Subject } from '@/models/Subject';

/* ---------------------------------- TYPES --------------------------------- */

export type TaskStats = {
  total: number;
  pending: number;
  completedThisWeek: number;
  overdue: number;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO string
  time?: string;
  subjectCode?: string;
};

export type SubjectChip = {
  id: string;
  code: string;
  name: string;
  color: string;
};

/* --------------------------------- HELPERS -------------------------------- */

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Sunday of the current week, at 00:00 UTC
function startOfWeek() {
  const sunday = startOfToday();
  sunday.setUTCDate(sunday.getUTCDate() - sunday.getUTCDay());
  return sunday;
}

/* ------------------------------- TASK STATS ------------------------------- */

export async function getTaskStats(userId: string): Promise<TaskStats> {
  await connectToDatabase();

  const tasks = await Task.find({ userId })
    .select('status dueDate completedAt')
    .lean<{ status: TaskStatus; dueDate: Date; completedAt?: Date }[]>();

  const today = startOfToday();
  const weekStart = startOfWeek();

  let pending = 0;
  let completedThisWeek = 0;
  let overdue = 0;

  for (const task of tasks) {
    if (task.status === 'completed') {
      if (task.completedAt && task.completedAt >= weekStart) completedThisWeek += 1;
    } else {
      pending += 1;
      if (task.dueDate < today) overdue += 1;
    }
  }

  return { total: tasks.length, pending, completedThisWeek, overdue };
}

/* ----------------------------- UPCOMING EVENTS ---------------------------- */

type EventDoc = {
  _id: Types.ObjectId;
  title: string;
  type: EventType;
  date: Date;
  time?: string;
  subjectId: { code: string } | null; // populated
};

export async function getUpcomingEvents(userId: string, limit = 4): Promise<UpcomingEvent[]> {
  await connectToDatabase();

  const events = await Event.find({ userId, date: { $gte: startOfToday() } })
    .populate('subjectId', 'code')
    .sort({ date: 1, time: 1 })
    .limit(limit)
    .lean<EventDoc[]>();

  return events.map((event) => ({
    id: event._id.toString(),
    title: event.title,
    type: event.type,
    date: event.date.toISOString(),
    time: event.time,
    subjectCode: event.subjectId?.code,
  }));
}

/* -------------------------------- SUBJECTS -------------------------------- */

export async function getSubjectChips(userId: string): Promise<SubjectChip[]> {
  await connectToDatabase();

  const subjects = await Subject.find({ userId })
    .select('name code color')
    .sort({ code: 1 })
    .lean<{ _id: Types.ObjectId; name: string; code: string; color: string }[]>();

  return subjects.map((subject) => ({
    id: subject._id.toString(),
    code: subject.code,
    name: subject.name,
    color: subject.color,
  }));
}