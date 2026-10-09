'use client';

import Link from 'next/link';
import { updateSubject } from '../lib/actions';
import { useRouter } from 'next/navigation';

interface SubjectUpdateFormProps {
    id: string;
    name: string;
    code: string;
    instructor?: string;
    color: string;
    startDate?: Date;
    endDate?: Date;
} 

export default async function SubjectUpdateForm({ subject }: { subject: SubjectUpdateFormProps }) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 md:pl-[13.5rem]">      
            <form
                action={updateSubject}
                className="w-full max-w-[450px] rounded-2xl bg-white p-8 shadow-2xl"
            >

                <h2 className="text-lg font-semibold text-slate-900">Update Subject</h2>
                <p className="mt-1 text-sm text-slate-500">Fill in the subject details.</p>
                <input type="hidden" name="id" value={subject?.id} />
                <label
                    htmlFor="name"
                    className="mt-4 block text-sm font-medium text-slate-800">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: Database Systems"
                    defaultValue={subject?.name}
                />

                <label
                    htmlFor="code"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >Code</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: CS101"
                    defaultValue={subject?.code}
                />

                <label
                    htmlFor="instructor"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >Instructor</label>
                <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: John Doe"
                    defaultValue={subject?.instructor}
                />

                <label
                    htmlFor="color"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >Color</label>
                <input
                    type="color"
                    id="color"
                    name="color"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 text-md
                        [&::-webkit-color-swatch-wrapper]:p-0
                        [&::-webkit-color-swatch]:rounded-xl
                        [&::-webkit-color-swatch]:border-0
                        [&::-moz-color-swatch]:rounded-xl
                        [&::-moz-color-swatch]:border-0
                        focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    defaultValue={subject?.color}
                />

                <label
                    htmlFor="startDate"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >Start Date</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    defaultValue={subject?.startDate?.toISOString().split('T')[0]}
                />

                <label
                    htmlFor="endDate"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >End Date</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    defaultValue={subject?.endDate?.toISOString().split('T')[0]}
                />

                <div className="mt-8 flex gap-4">
                    <Link
                        href="/subjects"
                        className="flex justify-center items-center h-[50px] flex-1 rounded-xl border border-slate-200 font-medium hover:cursor-pointer"
                    >
                        <button
                        type="button"
                        onClick={() => router.back()} 
                        className="h-[50px] hover:cursor-pointer">
                            Cancel
                        </button>
                    </Link>
                    <button type="submit" className="h-[50px] flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 hover:cursor-pointer">
                        Save subject
                    </button>
                </div>
            </form>
        </div>
    )
}