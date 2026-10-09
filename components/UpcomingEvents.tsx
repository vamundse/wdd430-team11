import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import type { UpcomingEvent } from '@/lib/dashboard';
import type { EventType } from '@/models/Event';

const TYPE_LABELS: Record<EventType, string> = {
  class: 'Class',
  exam: 'Exam',
  meeting: 'Meeting',
  deadline: 'Deadline',
};

// "09 Sep". timeZone UTC keeps the date from shifting to the day before.
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
});

export default function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  return (
    <section
      aria-labelledby="events-heading"
      className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 id="events-heading" className="flex items-center gap-2 font-semibold text-slate-900">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Upcoming events
        </h2>
        <Link href="/events" className="text-sm font-medium text-blue-700 hover:underline">
          View all
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-slate-600">
          No upcoming events.{' '}
          <Link href="/events/new" className="font-medium text-blue-700 hover:underline">
            Add one
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
              >
                <time
                  dateTime={event.date.slice(0, 10)}
                  className="w-16 shrink-0 rounded-md bg-blue-50 px-2 py-1 text-center text-xs font-semibold text-blue-800"
                >
                  {dayFormat.format(new Date(event.date))}
                </time>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {event.title}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {[event.time, TYPE_LABELS[event.type], event.subjectCode]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}