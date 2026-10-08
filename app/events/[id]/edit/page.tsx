import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getEventById } from "@/lib/events";
import { updateEventAction } from "../../actions";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({
  params,
}: EditEventPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <p className="text-gray-700">
          Please log in to edit your events.
        </p>
      </div>
    );
  }

  const { id } = await params;

  const event = await getEventById(id, session.user.id);

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.date)
    .toISOString()
    .split("T")[0];

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 px-6 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <Link
            href="/events"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Events
          </Link>

          <h1 className="mt-4 text-3xl font-semibold text-gray-800">
            Edit Event
          </h1>

          <p className="mt-2 text-gray-600">
            Update the details of your event.
          </p>
        </div>

        <form
          action={updateEventAction.bind(null, id)}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Event Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={event.title}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Event Type
            </label>

            <select
              id="type"
              name="type"
              required
              defaultValue={event.type}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="class">Class</option>
              <option value="exam">Exam</option>
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={formattedDate}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Time
            </label>

            <input
              id="time"
              name="time"
              type="time"
              defaultValue={event.time ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/events"
              className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}