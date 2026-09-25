import Link from 'next/link';
import LogoutButton from './logout-button';
import Image from 'next/image';

export default function Navigation() {
    return (
        <aside className="bg-slate-800 text-white py-4 shadow-md min-h-screen">
            <div className="container mx-auto px-4 flex flex-col gap-4">
            <div id="header-title">
                <Image
                    src="/logo-white.png"
                    alt="StudyHub"
                    width={1206}
                    height={926}
                    className="h-20 w-auto"
                    priority
                />
            </div>
                
                <nav aria-label="Primary" className="flex">
                    <ul className="flex flex-col justify-between gap-4">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/calendar">Calendar</Link></li>
                        <li><Link href="/tasks">Tasks</Link></li>
                        <li><Link href="/subjects">Subjects</Link></li>
                        <li><LogoutButton /></li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}