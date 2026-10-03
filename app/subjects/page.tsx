import SubjectList from "../../components/SubjectList";
import Link from "next/link";

export default async function Subjects() {
    return (
        <main className="min-h-screen w-full bg-slate-50 p-4">
            
                <h1 className="text-3xl font-bold">Subjects</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="space-x-4">
                    <Link href="/subjects">
                        All (4)
                    </Link>
                    <Link href="/subjects?status=in_progress">
                        In Progress (3)
                    </Link>
                    <Link href="/subjects?status=completed">
                        Completed (1)
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
