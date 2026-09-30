// app/signup/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import SignupForm from '@/components/signup-form';

export const metadata = {
  title: 'Sign up | StudyHub',
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="StudyHub logo"
              width={1206}
              height={926}
              className="h-28 w-auto"
              priority
            />
          </Link>
          <p className="mt-3 text-sm text-slate-600">
            Create your account and start organizing your studies.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}