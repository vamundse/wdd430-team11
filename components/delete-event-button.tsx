"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteEventAction } from "@/app/events/actions";

interface DeleteEventButtonProps {
eventId: string;
eventTitle?: string;
}

export default function DeleteEventButton({
  eventId,
  eventTitle,
  }: DeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
  const confirmed = window.confirm(
  `Are you sure you want to delete the event "${eventTitle ?? ''}"?`
  );


  if (!confirmed) {
    return;
  }

  startTransition(async () => {
    await deleteEventAction(eventId);
  });


}

  return (
  <button
  type="button"
  onClick={handleDelete}
  disabled={isPending}
  aria-label={isPending ? `Deleting event "${eventTitle ?? ''}"` : `Delete event "${eventTitle ?? ''}"`}
  title={isPending ? `Deleting event "${eventTitle ?? ''}"...` : `Delete event "${eventTitle ?? ''}"`}
  className="inline-flex items-center justify-center rounded-lg border border-red-300 p-2.5 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
  > <Trash2 size={18} aria-hidden="true" /> </button>
  );
}
