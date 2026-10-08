import Link from 'next/link';
import LogoutButton from './logout-button';
import Image from 'next/image';
import { BookOpen, CalendarDays, House, ListTodo } from 'lucide-react';

const navigationLinks = [
    { href: '/', label: 'Home', icon: House },
    { href: '/event', label: 'Events', icon: CalendarDays },
    { href: '/tasks', label: 'Tasks', icon: ListTodo },
    { href: '/subjects', label: 'Subjects', icon: BookOpen },
];

export default function Navigation() {
    return (
        <aside className="bg-slate-800 text-white py-4 shadow-md min-h-screen">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
            <div id="header-title">
                <Link href="/">
                    <Image
                        src="/logo-white.png"
                        alt="StudyHub"
                        width={1206}
                        height={926}
                        className="h-20 w-auto"
                        priority
                    />
                </Link>
            </div>
                
                <nav aria-label="Primary" className="mt-4 w-full">
                    <ul className="flex w-full flex-col gap-2">
                        {navigationLinks.map(({ href, label, icon: Icon }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-blue-500 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                                >
                                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                        <li className="mt-3 border-t border-slate-600 pt-4">
                            <LogoutButton />
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}