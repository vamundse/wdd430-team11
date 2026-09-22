import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-8 py-6">
      <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 md:flex-row">
        <p>© 2026 StudyHub. All rights reserved.</p>

        <nav
          aria-label="Footer navigation"
          className="flex items-center gap-4"
        >
          <Link
            href="/"
            className="transition hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            href="/subjects"
            className="transition hover:text-slate-900"
          >
            Subjects
          </Link>

          <Link
            href="/tasks"
            className="transition hover:text-slate-900"
          >
            Tasks
          </Link>

          <Link
            href="/calendar"
            className="transition hover:text-slate-900"
          >
            Calendar
          </Link>
        </nav>
      </div>
    </footer>
  );
}