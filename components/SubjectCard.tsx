import Link from "next/link";
import type { SubjectDetailsProps } from "./SubjectDetails";

interface SubjectCardProps {
    subject: SubjectDetailsProps;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    return (
        <div className="border-l-4 border-l-blue-300 rounded-lg">
                <Link href={`/subjects/${subject.id}`} key={subject.code}> 
                <div className="p-4 bg-white rounded-lg shadow hover:bg-blue-100 hover:cursor-pointer" key={subject.code}>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-semibold">{subject.code}</h2>
                        <p className="rounded-full bg-gray-200 px-4 py-1 text-sm font-medium">{subject.status}</p>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                        <p className="text-lg text-gray-900">{subject.name} - </p>
                        <p className="text-gray-600">{subject.instructor}</p>
                    </div>
                    {subject.progress !== undefined && (
                        <div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded-full">
                                    <div
                                        className="h-4 bg-blue-500 rounded-full"
                                        style={{ width: `${subject.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <span className="text-md font-medium text-gray-700 text-right block mt-1">{subject.progress}%</span>
                        </div>
                    )}
                </div>
                </Link>
        </div>
    );
}