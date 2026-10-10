import SubjectList from "@/components/SubjectList";
import Link from "next/link";
import { getSubjects } from "../../lib/actions";

export default async function SubjectsPage({ searchParams }: { searchParams: Promise<{ status?: string | string[] }>} ) { 
    const {status: requestedStatus } = await searchParams;
    const status =
        requestedStatus === 'in_progress' ||
        requestedStatus === 'completed' ||
        requestedStatus === 'dropped'
        ? requestedStatus
        : null;
    
    // Count the logged-in user's subjects instead of hardcoding the numbers
    const allSubjects = await getSubjects(null);

    const inProgressCount = allSubjects.filter((subject) => subject.status === "in_progress").length;
    const completedCount = allSubjects.filter((subject) => subject.status === "completed").length;
    const droppedCount = allSubjects.filter((subject) => subject.status === "dropped").length;

    const visibleSubjects =
        status === null
            ? allSubjects
            : allSubjects.filter((subject) => subject.status === status);

    return (
        <div className="flex-1 bg-slate-50 px-6 py-8 mx:px-10">
            <div className="mx-auto w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Subjects</h1>
                    <Link href="/subjects/create" className="cursor-pointer text-md bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-500">
                            + Add Subject
                    </Link>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <nav 
                        aria-label="Subject status filter"
                        className="flex gap-1 text-gray-700 text-sm"
                    >
                        <Link
                            href="/subjects"
                            aria-current={status === null ? "page" : undefined}
                            className={`pl-4 pr-4 pt-1 pb-1 rounded-2xl ${status === null ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            All ({allSubjects.length})
                        </Link>
                        <Link
                            href="/subjects?status=in_progress"
                            aria-current={status === 'in_progress' ? "page" : undefined}
                            className={`pl-4 pr-4 pt-1 pb-1 rounded-2xl ${status === 'in_progress' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            In Progress ({inProgressCount})
                        </Link>
                        <Link
                            href="/subjects?status=completed"
                            aria-current={status === 'completed' ? "page" : undefined}
                            className={`pl-4 pr-4 pt-1 pb-1 rounded-2xl ${status === 'completed' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            Completed ({completedCount})
                        </Link>
                        <Link
                            href="/subjects?status=dropped"
                            aria-current={status === 'dropped' ? "page" : undefined}
                            className={`pl-4 pr-4 pt-1 pb-1 rounded-2xl ${status === 'dropped' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            Dropped ({droppedCount})
                        </Link>
                    </nav>
                </div>
                {visibleSubjects.length === 0 ? (
                    <Link href="/subjects/create">
                        <p className="h-[100px] text-gray-500 bg-white p-4 border-dashed border-1 border-gray-300 rounded-lg flex justify-center items-center hover:bg-blue-100">You have no subjects. Click here to add a new subject.</p>
                    </Link>
                ) : (
                    <SubjectList subjects={visibleSubjects} />
                )}
            </div>
        </div>
    )
}
