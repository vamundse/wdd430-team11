import Link from 'next/link';
import type { SubjectChip } from '@/lib/dashboard';

export default function SubjectChips({ subjects }: { subjects: SubjectChip[] }) {
  return (
    <section
      aria-labelledby="subjects-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 id="subjects-heading" className="font-semibold text-slate-900">
          Your subjects
        </h2>
        <Link href="/subjects" className="text-sm font-medium text-blue-700 hover:underline">
          View all
        </Link>
      </div>

      {subjects.length === 0 ? (
        <p className="text-sm text-slate-600">You have no subjects yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <Link
                href={`/subjects/${subject.id}`}
                className="block h-full rounded-lg border border-l-4 border-slate-200 p-3 hover:bg-slate-50"
                style={{ borderLeftColor: subject.color }}
              >
                <span className="block font-semibold text-slate-900">{subject.code}</span>
                <span className="block text-xs text-slate-600">{subject.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}