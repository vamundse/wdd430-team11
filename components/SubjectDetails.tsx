import { getSubjectById } from "../lib/actions";
import { notFound } from "next/navigation";

export interface SubjectDetailsProps {
    id: string;
    name: string;
    code: string;
    instructor?: string;
    status?: string;
    progress?: number;
    color?: string;
    tasks?: string[];
}

export default async function SubjectDetails({ id }: { id: string }) {
    const subject = await getSubjectById(id);
    console.log(subject);
    
    // getSubjectById returns null when the subject doesn't exist
    // or belongs to another user
    
    if (!subject) {
        notFound();
    }

    return (
        <div className="text-gray-800 bg-white p-4 rounded-lg shadow w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">{subject.name} ({subject.code})</h1>
            {subject.instructor && <p className="mt-2">Instructor: {subject.instructor}</p>}
            {subject.status && <p className="mt-2">Status: {subject.status}</p>}
            <div className="mt-2">
                    <div className="h-4 bg-gray-200 rounded-full">
                        <div
                            className="h-4 rounded-full"
                            style={{ width: `${subject.progress}%`,
                            backgroundColor: subject.color }}
                        ></div>
                    </div>
                    <div className="text-right text-md mt-1">{subject.progress}%</div>
            </div>
            {/* <h2 className="text-xl font-semibold mt-4">Tasks</h2> 
            <ul className="mt-2">
                {subject.tasks?.map((task, index) => (
                    <li className="flex items-center gap-2 p-2 rounded-md hover:underline hover:bg-blue-100 hover:cursor-pointer" key={index}>
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>{task}</li>
                ))}
            </ul>
            </ul> */}
        </div>
    );
}