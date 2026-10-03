import { CircleCheck } from 'lucide-react';
import type { TaskListItem } from '@/lib/tasks';

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-800',
  low: 'bg-emerald-50 text-emerald-700',
} as const;

const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const;

// "09 Sep, 23:59" — shown in UTC, the same way it was saved
function formatDue(iso: string) {
  const date = new Date(iso);
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  return `${day}, ${time}`;
}

export default function TaskCard({ task }: { task: TaskListItem }) {
  const isDone = task.status === 'completed';

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4">
      <div className="min-w-0">
        <h2
          className={`font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}
        >
          {task.title}
        </h2>
        <p className="text-sm text-slate-500">
          {task.subjectLabel}
          {!isDone && (
            <>
              {' - Due '}
              <time dateTime={task.dueDate}>{formatDue(task.dueDate)}</time>
            </>
          )}
        </p>
      </div>

      {isDone ? (
        <span className="shrink-0 text-emerald-600">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Completed</span>
        </span>
      ) : (
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
          <span className="sr-only"> priority</span>
        </span>
      )}
    </li>
  );
}
