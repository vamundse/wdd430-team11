import { logout } from '@/lib/actions';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-left text-white hover:text-slate-300 cursor-pointer"
      >
        Log out
      </button>
    </form>
  );
}