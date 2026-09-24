import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-slate-800 text-white py-4 shadow-md min-h-screen">
            <div className="container mx-auto px-4 flex flex-col gap-4">
                
                <nav className="flex">
                    <ul className="flex flex-col justify-between gap-4">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/calendar">Calendar</Link></li>
                        <li><Link href="/tasks">Tasks</Link></li>
                        <li><Link href="/subjects">Subjects</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}