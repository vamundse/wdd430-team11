import { Bell, ChevronDown } from "lucide-react";
import { auth } from "@/auth";
import { logout } from "@/lib/actions";

export default async function Header() {
const session = await auth();
const displayName = session?.user?.name ?? session?.user?.email ?? "User";
const userInitial = displayName.charAt(0).toUpperCase();

return ( <header className="flex h-20 items-center justify-end border-b border-slate-200 bg-white px-8"> <div className="flex items-center gap-5">
{session?.user && ( <button
         type="button"
         aria-label="Notifications"
         className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
       > <Bell className="h-5 w-5" />


        <span
          aria-hidden="true"
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"
        />
      </button>
    )}

    {session?.user ? (
      <details className="relative">
        <summary className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition hover:bg-slate-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            {userInitial}
          </span>

          <span className="hidden text-sm font-medium text-slate-700 md:block">
            {displayName}
          </span>

          <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
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
