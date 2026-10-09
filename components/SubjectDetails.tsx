'use client';

import { deleteSubject } from "../lib/actions";
import type { SubjectStatus } from "@/models/Subject";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export interface SubjectDetailsProps {
    id: string;
    name: string;
    code: string;
    instructor?: string;
    status: SubjectStatus;
    progress?: number;
    color?: string;
    tasks?: string[];
    startDate?: Date;
    endDate?: Date;
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

export default function SubjectDetails({ subject, progress }:
    { subject: SubjectDetailsProps; progress?: number }) {
    const status = subject.status;

    return (
        <div className="text-gray-800 bg-white w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">{subject.name}</h1>
                    <h2 className="text-md text-gray-600">{subject.code}</h2>
                </div>
                <div className="flex self-start gap-2">
                    <Link
                        href={`/subjects/${subject.id}/update`}
                        type="button"
                        aria-label={`Edit ${subject.name}`}>
                        <Pencil className="rounded-sm inline-block h-7 w-7 hover:cursor-pointer hover:bg-gray-200 p-1" />
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
                            <Trash2 className="rounded-sm inline-block h-7 w-7 hover:cursor-pointer p-1 hover:bg-red-200 hover:text-red-800" />
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div>
                    {status && <p className={`rounded-lg px-3 py-1 w-fit ${STATUS_STYLES[status]}`}>{formatStatus(status)}</p>}
                </div>
                <div>
                    {subject.instructor && <p className="text-md">Instructor: {subject.instructor}</p>}
                    
                    {subject.startDate && <p className="text-md">Start Date: {subject.startDate.toLocaleDateString()}</p>}
                    {subject.endDate && <p className="text-md">End Date: {subject.endDate.toLocaleDateString()}</p>}
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded-full flex-1 mr-3">
                        <div
                            className="h-4 rounded-full"
                            style={{ width: `${progress}%`,
                            backgroundColor: subject.color }}
                        ></div>
                    </div>
                    <span className="text-right text-md">{progress}%</span>
            </div>
        </div>
    );
}