import SubjectList from "@/components/SubjectList";
import Link from "next/link";
import { getSubjects } from "../../lib/actions";

export default async function Subjects() {
    // Count the logged-in user's subjects instead of hardcoding the numbers
    const subjects = await getSubjects();
    const inProgressCount = subjects.filter((subject) => subject.status === "in_progress").length;
    const completedCount = subjects.filter((subject) => subject.status === "completed").length;

    return (
        <main className="min-h-screen w-full bg-slate-50 p-4">
            
                <h1 className="text-3xl font-bold">Subjects</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="space-x-4">
                    <Link href="/subjects">
                        All ({subjects.length})
                    </Link>
                    <Link href="/subjects?status=in_progress">
                        In Progress ({inProgressCount})
                    </Link>
                    <Link href="/subjects?status=completed">
                        Completed ({completedCount})
                    </Link>
                </div>
                <Link href="/subjects/create">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Add Subject
                    </button>
                </Link>
            </div>
            <SubjectList  />
        </main>
    )
}
