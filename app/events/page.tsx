import Link from "next/link";
import { auth } from "@/auth";
import { getEventsByUserId } from "@/lib/events";
import type { EventType } from "@/models/Event";
import DeleteEventButton from "@/components/delete-event-button";

const eventTypeLabels: Record<EventType, string> = {
  class: "Class",
  exam: "Exam",
  meeting: "Meeting",
  deadline: "Deadline",
};

export default async function EventsPage() {
  const session = await auth();

  

  if (!session?.user?.id) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <p className="text-gray-700">
          Please log in to view your events.
        </p>
      </div>
    );
  }

  const events = await getEventsByUserId(session.user.id);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 px-6 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Events
            </h1>

            <p className="mt-2 text-gray-600">
              Keep track of your classes, exams, meetings, and deadlines.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/events/new"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Add Event
            </Link>

            <Link
              href="/calendar"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Show Calendar
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No events yet
            </h2>

            <p className="mt-2 text-gray-600">
              Your upcoming events will appear here.
            </p>

            <Link
              href="/events/new"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event._id.toString()}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/events/${event._id.toString()}`}
                      className="text-xl font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {event.title}
                    </Link>

                    {event.subjectId &&
                      typeof event.subjectId === "object" && (
                        <p className="mt-1 text-sm text-gray-500">
                          {event.subjectId.name}{" "}
                          {event.subjectId.code &&
                            `(${event.subjectId.code})`}
                        </p>
                      )}
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {eventTypeLabels[event.type as EventType]}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>

                  {event.time && (
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {event.time}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <Link
                    href={`/events/${event._id.toString()}/edit`}
                    className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    Edit
                  </Link>

                  <DeleteEventButton
                    eventId={event._id.toString()}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}