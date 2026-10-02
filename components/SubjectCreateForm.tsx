import Link from 'next/link';
import { createSubject } from '../lib/actions';

export default function SubjectCreateForm() {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 md:pl-[13.5rem]">      
            <form
                action={createSubject}
                className="w-full max-w-[560px] rounded-2xl bg-white p-8 shadow-2xl"
            >

                <h2 className="text-2xl font-semibold text-slate-900">New subject</h2>
                <p className="mt-1 text-slate-500">Fill in the subject details.</p>

                <label
                    htmlFor="name"
                    className="mt-6 block text-sm font-medium text-slate-800">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-2 h-[60px] w-full rounded-xl border border-slate-200 px-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: Database Systems"
                />

                <label
                    htmlFor="code"
                    className="mt-6 block text-sm font-medium text-slate-800"
                >Code</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    className="mt-2 h-[60px] w-full rounded-xl border border-slate-200 px-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: CS101"
                />

                <label
                    htmlFor="instructor"
                    className="mt-6 block text-sm font-medium text-slate-800"
                >Instructor</label>
                <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    className="mt-2 h-[60px] w-full rounded-xl border border-slate-200 px-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: John Doe"
                />

                <label
                    htmlFor="color"
                    className="mt-6 block text-sm font-medium text-slate-800"
                >Color</label>
                <input
                    type="color"
                    id="color"
                    name="color"
                    className="mt-2 h-[60px] w-full rounded-xl border border-slate-200 px-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />

                <label
                    htmlFor="startDate"
                    className="mt-6 block text-sm font-medium text-slate-800"
                >Start Date</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="mt-2 h-[60px] w-full rounded-xl border border-slate-200 px-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-8 flex gap-4">
                    <Link
                        href="/subjects"
                        className="flex justify-center items-center h-[58px] flex-1 rounded-xl border border-slate-200 font-medium hover:cursor-pointer"
                    >
                        <button type="button" className="hover:cursor-pointer">
                            Cancel
                        </button>
                    </Link>
                    <button type="submit" className="h-[58px] flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 hover:cursor-pointer">
                        Save subject
                    </button>
                </div>
            </form>
        </div>
    )
}