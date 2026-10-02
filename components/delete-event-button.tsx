"use client";

import { useTransition } from "react";
import { deleteEventAction } from "@/app/events/actions";

interface DeleteEventButtonProps {
  eventId: string;
}

export default function DeleteEventButton({
  eventId,
}: DeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
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
      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}