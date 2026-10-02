import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getEventById } from "@/lib/events";
import type { EventType } from "@/models/Event";

const eventTypeLabels: Record<EventType, string> = {
  class: "Class",
  exam: "Exam",
  meeting: "Meeting",
  deadline: "Deadline",
};

interface EventDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const session = await auth();
 
  

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-700">
          Please log in to view this event.
        </p>
      </div>
    );
  }

  const { id } = await params;

  const event = await getEventById(id, session.user.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 px-6 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <Link
            href="/events"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Events
          </Link>

          <h1 className="mt-4 text-3xl font-semibold text-gray-800">
            Event Details
          </h1>

          <p className="mt-2 text-gray-600">
            View the details of your event.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {event.title}
              </h2>

              {event.subjectId &&
                typeof event.subjectId === "object" && (
                  <p className="mt-2 text-gray-500">
                    {event.subjectId.name}
                    {event.subjectId.code &&
                      ` (${event.subjectId.code})`}
                  </p>
                )}
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {eventTypeLabels[event.type as EventType]}
            </span>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-5">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Event Type
              </p>

              <p className="mt-1 text-gray-800">
                {eventTypeLabels[event.type as EventType]}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Date
              </p>

              <p className="mt-1 text-gray-800">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>

            {event.time && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Time
                </p>

                <p className="mt-1 text-gray-800">
                  {event.time}
                </p>
              </div>
            )}

            {event.subjectId &&
              typeof event.subjectId === "object" && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Subject
                  </p>

                  <p className="mt-1 text-gray-800">
                    {event.subjectId.name}
                    {event.subjectId.code &&
                      ` (${event.subjectId.code})`}
                  </p>
                </div>
              )}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
            <Link
              href="/events"
              className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back
            </Link>

            <Link
              href={`/events/${event._id.toString()}/edit`}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Edit Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

