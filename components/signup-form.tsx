// components/signup-form.tsx
'use client';

import { useActionState, useState } from 'react';
import { register } from '@/lib/actions';

const inputClass =
  'block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2';
const okClass = 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20';
const errorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <h1 className="text-xl font-semibold text-slate-900">Create account</h1>

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
          defaultValue={state?.values?.name}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={`${inputClass} ${errors.name ? errorClass : okClass}`}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          defaultValue={state?.values?.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`${inputClass} ${errors.email ? errorClass : okClass}`}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={`${inputClass} pr-16 ${errors.password ? errorClass : okClass}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 cursor-pointer px-3 text-sm text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <FieldError id="password-error" message={errors.password} />
      </div>

      {/* Confirm password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          placeholder="Repeat your password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          className={`${inputClass} ${errors.confirmPassword ? errorClass : okClass}`}
        />
        <FieldError id="confirmPassword-error" message={errors.confirmPassword} />
      </div>

      {/* General error */}
      <div aria-live="polite" aria-atomic="true">
        {state?.message && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Creating account…' : 'Sign up'}
      </button>
    </form>
  );
}