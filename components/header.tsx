
import { ChevronDown } from "lucide-react";
import { auth } from "@/auth";
import { logout } from "@/lib/actions";

export default async function Header() {
  const session = await auth();
  const displayName =
    session?.user?.name ?? session?.user?.email ?? "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex h-20 items-center justify-end border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-5">
        {session?.user ? (
          <details className="relative">
            <summary
              aria-label={`Account menu for ${displayName}`}
              className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition hover:bg-slate-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {userInitial}
              </span>

              <span className="hidden text-sm font-medium text-slate-700 md:block">
                {displayName}
              </span>

              <ChevronDown
                aria-hidden="true"
                className="hidden h-4 w-4 text-slate-500 md:block" />
            </summary>

            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-white shadow-lg">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </form>
            </div>
          </details>
        ) : (
          <a
            href="/login"
            className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
}

