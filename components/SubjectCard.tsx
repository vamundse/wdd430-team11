'use client';

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react"
import type { SubjectDetailsProps } from "./SubjectDetails";
import { deleteSubject } from "../lib/actions";

interface SubjectCardProps {
    subject: SubjectDetailsProps;
    progress: number;
}

function formatStatus(status: SubjectDetailsProps["status"]) {
    if (!status) return "";
    let newStatus = status.replace("_", " ");
    newStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    return newStatus;
}

const STATUS_STYLES = {
    in_progress: "bg-blue-200 text-blue-950",
    completed: "bg-green-200 text-green-950",
    dropped: "bg-red-200 text-red-950"
} as const;

export default function SubjectCard({ subject, progress }: SubjectCardProps) {
    const status = subject.status;
    return (
        <div
            className={`border-l-10 rounded-lg`}
            style={{ borderColor: subject.color }}
            >
                <div className="p-4 bg-white rounded-lg shadow" key={subject.code}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Link href={`/subjects/${subject.id}`} key={subject.code}> 
                                <h2 className="text-lg font-semibold">{subject.code}</h2>
                            </Link>
                            <Link
                                href={`/subjects/${subject.id}/update`}
                                type="button"
                                aria-label={`Edit ${subject.name}`}>
                                <Pencil className="rounded-sm inline-block h-6 w-6 hover:cursor-pointer hover:bg-gray-200 p-1" />
                            </Link>
                            <form
                                action={deleteSubject.bind(null, subject.id)}
                                onSubmit={(event) => {
                                    if (!window.confirm(`Delete "${subject.code} - ${subject.name}" and all of its tasks? This cannot be undone.`)) {
                                    event.preventDefault();
                                    }
                                }}>
                                <button
                                    type="submit"
                                    aria-label={`Delete ${subject.name}`}>
                                    <Trash2 className="rounded-sm inline-block h-6 w-6 hover:cursor-pointer p-1 hover:bg-red-200 hover:text-red-800" />
                                </button>
                            </form>
                        </div>
                        <p className={`rounded-full ${STATUS_STYLES[status]} px-4 py-1 text-xs font-medium`}>{formatStatus(status)}</p>
                    </div>
                    <Link href={`/subjects/${subject.id}`} key={subject.code}>
                    <div className="flex items-center space-x-2 mb-2">
                            <p className="text-md text-gray-900">{subject.name} -</p>
                            <p className="text-gray-600">{subject.instructor}</p>
                    </div>
                    </Link>
                    <div>
                    <div className="w-full flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded-full flex-1 mr-3">
                            <div
                                className="h-3 rounded-full"
                                style={{ width: `${progress}%`,
                                backgroundColor: subject.color }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 text-right block">{progress}%</span>
                    </div>
                </div>
                </div>
        </div>
    );
}