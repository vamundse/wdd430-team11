import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";

export async function getEventsByUserId(userId: string) {
  await connectToDatabase();

  return Event.find({ userId })
    .populate("subjectId", "name code color")
    .sort({ date: 1, time: 1 })
    .lean();
}

export async function getEventById(eventId: string, userId: string) {
  await connectToDatabase();

  return Event.findOne({
    _id: eventId,
    userId,
  })
    .populate("subjectId", "name code color")
    .lean();
}

export async function createEvent(data: {
  userId: string;
  subjectId?: string;
  title: string;
  type: "class" | "exam" | "meeting" | "deadline";
  date: Date;
  time?: string;
}) {
  await connectToDatabase();

  return Event.create({
    userId: data.userId,
    subjectId: data.subjectId || undefined,
    title: data.title,
    type: data.type,
    date: data.date,
    time: data.time || undefined,
  });
}

export async function updateEvent(
  eventId: string,
  userId: string,
  data: {
    subjectId?: string;
    title: string;
    type: "class" | "exam" | "meeting" | "deadline";
    date: Date;
    time?: string;
  }
) {
  await connectToDatabase();

  return Event.findOneAndUpdate(
    {
      _id: eventId,
      userId,
    },
    {
      subjectId: data.subjectId || undefined,
      title: data.title,
      type: data.type,
      date: data.date,
      time: data.time || undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteEvent(eventId: string, userId: string) {
  await connectToDatabase();

  return Event.findOneAndDelete({
    _id: eventId,
    userId,
  });
}