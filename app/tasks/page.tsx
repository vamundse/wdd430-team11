import Link from 'next/link';
import type { Metadata } from 'next';
import { requireUserId } from '@/lib/session';
import { getSubjectOptions, getTasksForUser } from '@/lib/tasks';
import TaskCard from '@/components/TaskCard';
import NewTaskModal from '@/components/NewTaskModal';

export const metadata: Metadata = {
  title: 'Tasks | StudyHub',
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
] as const;

type Filter = (typeof FILTERS)[number]['value'];

function isFilter(value: unknown): value is Filter {
  return FILTERS.some((filter) => filter.value === value);
}

export default async function TasksPage({ searchParams }: PageProps<'/tasks'>) {
  const { status } = await searchParams;
  const activeFilter: Filter = isFilter(status) ? status : 'all';

  const userId = await requireUserId();
  const [tasks, subjects] = await Promise.all([
    getTasksForUser(userId),
    getSubjectOptions(userId),
  ]);

  const counts: Record<Filter, number> = {
    all: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    in_progress: tasks.filter((task) => task.status === 'in_progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  };

  const visibleTasks =
    activeFilter === 'all' ? tasks : tasks.filter((task) => task.status === activeFilter);

  return (
    <div className="flex-1 bg-slate-50 px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
            <p className="text-slate-600">
              You have {counts.pending} pending {counts.pending === 1 ? 'task' : 'tasks'}.
            </p>
          </div>
          <NewTaskModal subjects={subjects} />
        </div>

        <nav aria-label="Filter tasks">
          <ul className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = filter.value === activeFilter;
              return (
                <li key={filter.value}>
                  <Link
                    href={filter.value === 'all' ? '/tasks' : `/tasks?status=${filter.value}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label} ({counts[filter.value]})
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {visibleTasks.length === 0 ? (
          <p role="status" className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-slate-500">
            {tasks.length === 0 ? 'No tasks yet. Click "New task" to add your first one.' : 'No tasks in this list.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
