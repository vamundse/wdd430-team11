import { AlertCircle, Circle, CircleCheck } from 'lucide-react';
import type { SubjectOption, TaskListItem } from '@/lib/tasks';
import { toggleTaskCompleted } from '@/lib/task-actions';
import TaskModal from '@/components/TaskModal';
import DeleteTaskButton from '@/components/DeleteTaskButton';


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

export default function TaskCard({
  task,
  subjects,
}: {
  task: TaskListItem;
  subjects: SubjectOption[]; // for the subject list in the edit form
}) {
  const isDone = task.status === 'completed';
  const toggleThisTask = toggleTaskCompleted.bind(null, task.id);

  return (
    <li
      className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${
        task.isOverdue
          ? 'border-red-200 border-l-4 border-l-red-500 bg-red-50/50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <form action={toggleThisTask}>
        <button
          type="submit"
          aria-label={
            isDone
              ? `Mark "${task.title}" as not completed`
              : `Mark "${task.title}" as completed`
          }
          className={`flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            isDone ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
          }`}
        >
          {isDone ? (
            <CircleCheck className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Circle className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </form>

      <div className="min-w-0 flex-1">
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

          {!isDone && (
            <>
              {' - '}
              {task.isOverdue ? (
                <span className="inline-flex items-center gap-1 font-medium text-red-700">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  Overdue since <time dateTime={task.dueDate}>{formatDue(task.dueDate)}</time>
                </span>
              ) : (
                <>
                  Due <time dateTime={task.dueDate}>{formatDue(task.dueDate)}</time>
                </>
              )}
            </>
          )}

      <div className="flex shrink-0 items-center">
        <TaskModal subjects={subjects} task={task} />
        <DeleteTaskButton id={task.id} title={task.title} />
      </div>
    </li>
  );
}
