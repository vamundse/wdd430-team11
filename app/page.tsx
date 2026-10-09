import Link from 'next/link';
import { auth } from '@/auth';
import { getSubjectChips, getTaskStats, getUpcomingEvents } from '@/lib/dashboard';
import StatCard from '@/components/StatCard';
import UpcomingEvents from '@/components/UpcomingEvents';
import SubjectChips from '@/components/SubjectChips';
import Image from 'next/image';


export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name ?? 'there';
  const userId = session?.user?.id;

  const dashboard = userId
    ? await Promise.all([
        getTaskStats(userId),
        getUpcomingEvents(userId),
        getSubjectChips(userId),
      ]).then(([stats, events, subjects]) => ({ stats, events, subjects }))
    : null;

  return (
    <div className="flex flex-1 bg-slate-50">
      <div className="flex-1 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">   {/* ← volta esta */}
          {/* Welcome text (no card) */}
          <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome to StudyHub
          </h1>
          <p className="mt-1 text-slate-600">Your hub for all study resources.</p>
          <p className="mt-4 break-words text-xl font-semibold text-slate-800">
            Hello, {userName}! 👋
          </p>

          {!session && (
            <>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sign in to continue, or create an account to get started.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
        </header>

        {dashboard && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <section
                aria-labelledby="summary-heading"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 id="summary-heading" className="text-xl font-semibold text-slate-900">
                  Your summary
                </h2>
                <p className="text-slate-600">Here&apos;s a summary of your academic activities.</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <StatCard
                    label="Pending tasks"
                    value={dashboard.stats.pending}
                    detail={`of ${dashboard.stats.total} total`}
                    tone="blue"
                  />
                  <StatCard
                    label="Completed"
                    value={dashboard.stats.completedThisWeek}
                    detail="this week"
                    tone="green"
                  />
                  <StatCard
                    label="Overdue"
                    value={dashboard.stats.overdue}
                    detail="needs attention"
                    tone="red"
                  />
                </div>
              </section>

              <SubjectChips subjects={dashboard.subjects} />
            </div>

            <UpcomingEvents events={dashboard.events} />
          </div>
        )}
        
      </div>
      </div>
        <aside className="relative hidden w-72 shrink-0 overflow-hidden xl:block">
          <Image
            src="/hero-study.jpg"
            alt=""
            fill
            priority
            sizes="288px"
            className="object-cover object-[65%_center]"
          />

          {/* 1. Soft fade into the page on the left edge */}
          <div
            className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-slate-50 to-transparent"
            aria-hidden="true"
          />

          {/* 2. Navy tint at the bottom, same color as the sidebar */}
          <div
            className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/10 to-transparent"
            aria-hidden="true"
          />

          {/* 3. Quote over the photo */}
          <p className="absolute inset-x-0 bottom-0 p-6 text-lg font-medium italic leading-snug text-white">
            “...by small and simple things are great things brought to pass.”  Alma 37:6
          </p>
        </aside>
            
    </div>
  );
}