// app/login/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/login-form';
import Image from 'next/image';

export const metadata = {
  title: 'Login | StudyHub',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="StudyHub"
                width={1206}
                height={926}
                className="mx-auto h-28 w-auto"
                priority
              />
            </Link>
            
          </Link>
          <p className="mt-3 text-sm text-slate-600">
            Welcome back! Log in to continue studying.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}