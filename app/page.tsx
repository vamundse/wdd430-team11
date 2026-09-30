   import { auth } from '@/auth';

export default async function Home() {
    const session = await auth();
    const userName = session?.user?.name ?? 'there';

    return (
        <div className="flex flex-col items-center justify-center flex-1 bg-gray-100">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to StudyHub</h1>
          <h2 className="text-2xl font-semibold mb-2 text-gray-600">Hello, {userName}! 👋</h2>
          <p className="text-lg text-gray-700">Your hub for all study resources.</p>
        </div>
    );
}