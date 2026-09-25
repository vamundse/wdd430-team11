"use client";

import { Bell, ChevronDown, GraduationCap } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-9 w-9 text-slate-900" />
        <span className="text-2xl font-bold text-slate-900">StudyHub</span>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />

          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"
          />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1 transition hover:bg-slate-100"
          aria-label="Open user menu"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            J
          </span>

          <span className="hidden text-sm font-medium text-slate-700 md:block">
            John Doe
          </span>

          <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
        </button>
      </div>
    </header>
  );
}