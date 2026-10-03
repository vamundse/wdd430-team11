'use client';

import { Trash2 } from 'lucide-react';
import { deleteTask } from '@/lib/task-actions';

export default function DeleteTaskButton({ id, title }: { id: string; title: string }) {
  const deleteThisTask = deleteTask.bind(null, id);

  return (
    <form
      action={deleteThisTask}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={`Delete "${title}"`}
        className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
