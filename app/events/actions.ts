"use server";

import { auth } from "@/auth";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/events";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  type: z.enum(["class", "exam", "meeting", "deadline"]),
  date: z.string().min(1, "Event date is required"),
  time: z.string().optional(),
  subjectId: z.string().optional(),
});

export async function createEventAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parsed = EventSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    date: formData.get("date"),
    time: formData.get("time") || undefined,
    subjectId: formData.get("subjectId") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid event data.");
  }

  await createEvent({
    userId: session.user.id,
    title: parsed.data.title,
    type: parsed.data.type,
    date: new Date(parsed.data.date),
    time: parsed.data.time,
    subjectId: parsed.data.subjectId,
  });

  revalidatePath("/events");
  redirect("/events");
}

export async function updateEventAction(
  eventId: string,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parsed = EventSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    date: formData.get("date"),
    time: formData.get("time") || undefined,
    subjectId: formData.get("subjectId") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid event data.");
  }

  const updatedEvent = await updateEvent(eventId, session.user.id, {
    title: parsed.data.title,
    type: parsed.data.type,
    date: new Date(parsed.data.date),
    time: parsed.data.time,
    subjectId: parsed.data.subjectId,
  });

  if (!updatedEvent) {
    throw new Error("Event not found.");
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}/edit`);

  redirect("/events");
}

export async function deleteEventAction(eventId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const deletedEvent = await deleteEvent(eventId, session.user.id);

  if (!deletedEvent) {
    throw new Error("Event not found.");
  }

  revalidatePath("/events");
}