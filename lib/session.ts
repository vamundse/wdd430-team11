import { redirect } from 'next/navigation';
import { auth } from '@/auth';

// Returns the logged-in user's id, or sends the visitor to the login page.
export async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/login');
  }

  return userId;
}
