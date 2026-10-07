import { logout } from '@/lib/actions';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
      >
        <LogOut aria-hidden="true" className="h-5 w-5 shrink-0" />
        Log out
      </button>
    </form>
  );
}