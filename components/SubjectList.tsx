import Link from "next/link";
import type { SubjectDetailsProps } from "./SubjectDetails";

interface SubjectListProps {
    subjects: SubjectDetailsProps[]
}

export default function SubjectList({ subjects}: SubjectListProps) {
    return (
        <div className="space-y-4">
            {subjects.map(({ name, code, progress }) => (
                <Link href={`/subjects/${code}`} key={code}> 
                <div className="p-4 mb-4 bg-white rounded-lg shadow hover:bg-blue-100 hover:cursor-pointer" key={code}>
                    <h2 className="text-xl font-semibold">{name} ({code})</h2>
                    {progress !== undefined && (
                        <div>
                            <div className="flex justify-between">
                            <span>Progress: {progress}%</span>
                            </div>
                            <div>
                                <div className="h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-2 bg-blue-500 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </Link>
            ))}
        </div>
        
    );
}