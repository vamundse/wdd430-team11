export interface SubjectDetailsProps {
    name: string;
    code: string;
    instructor?: string;
    status?: string;
    progress?: number;
    tasks?: string[];
}

export default function SubjectDetails({name, code, instructor, status, progress, tasks}: SubjectDetailsProps) {
    return (
        <div className="text-gray-800">
            <h1 className="text-2xl font-bold">{name} ({code})</h1>
            {instructor && <p className="mt-2">Instructor: {instructor}</p>}
            {status && <p className="mt-2">Status: {status}</p>}
            <div className="mt-2">
                <span>Progress: {progress}%</span>
                <div className="mt-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-semibold mt-4">Tasks</h2>
            <ul className="mt-2">
                {tasks?.map((task, index) => (
                    <li className="flex items-center gap-2 p-2 rounded-md hover:underline hover:bg-blue-100 hover:cursor-pointer" key={index}>
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>{task}</li>
                ))}
            </ul>
        </div>
    );
}