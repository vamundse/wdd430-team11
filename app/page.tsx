import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name ?? 'there';

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome to StudyHub
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
          Your hub for all study resources.
        </p>

        <div className="mt-8 border-t border-slate-100 pt-8">
          <h2 className="break-words text-xl font-semibold text-slate-800">
            Hello, {userName}! 👋
          </h2>
          {!session && (
            <>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sign in to continue, or create an account to get started.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}