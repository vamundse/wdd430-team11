'use client';

import { useActionState } from 'react';
import type { SubjectFormState } from '../lib/actions';
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

const initialState: SubjectFormState = {};

export default function SubjectUpdateForm({ subject }: { subject: SubjectUpdateFormProps }) {
    const router = useRouter();
        const [ state, formAction, isPending ] =
            useActionState(updateSubject, initialState);
        const errors = state.errors?? {};

    return (
        <div className="w-full px-4 py-8">      
            <form
                action={formAction}
                className="mx-auto w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-sm"
            >

                <h1 
                    id="update-subject-form-heading"
                    className="text-lg font-semibold text-slate-900">Update Subject
                </h1>
                <p className="mt-1 text-sm text-slate-500">Fill in the subject details.</p>
                <input type="hidden" name="id" value={subject?.id} />
                <label
                    htmlFor="name"
                    className="mt-4 block text-sm font-medium text-slate-800">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={state.rawData?.name ?? subject.name}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'subject-name-error' : undefined}
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Ex: Database Systems"
                />
                <div id="subject-name-error" className="text-red-600 text-sm" aria-live="polite" aria-atomic="true">
                    {errors.name?.map((message) => (
                        <p key={message}>{message}</p>
                    )) }
                </div>
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
                    defaultValue={state.rawData?.code ?? subject.code}
                    aria-invalid={!!errors.code}
                    aria-describedby={errors.code ? 'subject-code-error' : undefined}
                />
                <div id="subject-code-error" className="text-red-600 text-sm" aria-live="polite" aria-atomic="true">
                    {errors.code?.map((message) => (
                        <p key={message}>{message}</p>
                    )) }
                </div>
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
                    defaultValue={state.rawData?.instructor ?? subject.instructor}
                    aria-invalid={!!errors.instructor}
                    aria-describedby={errors.instructor ? 'subject-instructor-error' : undefined}
                />
                <div id="subject-instructor-error" className="text-red-600 text-sm" aria-live="polite" aria-atomic="true">
                    {errors.instructor?.map((message) => (
                        <p key={message}>{message}</p>
                    )) }
                </div>
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
                    defaultValue={state.rawData?.color ?? subject.color}
                    aria-invalid={!!errors.color}
                    aria-describedby={errors.color ? 'subject-color-error' : undefined}
                />
                <div id="subject-color-error" className="text-red-600 text-sm" aria-live="polite" aria-atomic="true">
                    {errors.color?.map((message) => (
                        <p key={message}>{message}</p>
                    )) }
                </div>

                <label
                    htmlFor="startDate"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >Start Date</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    defaultValue={state.rawData?.startDate ?? subject.startDate?.toISOString().split('T')[0]}
                    aria-invalid={!!errors.startDate}
                    aria-describedby={errors.startDate ? 'subject-startDate-error' : undefined}
                />
                <div id="subject-startDate-error" className="text-red-600 text-sm" aria-live="polite" aria-atomic="true">
                    {errors.startDate?.map((message) => (
                        <p key={message}>{message}</p>
                    )) }
                </div>
                <label
                    htmlFor="endDate"
                    className="mt-4 block text-sm font-medium text-slate-800"
                >End Date</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="mt-2 h-[40px] w-full rounded-xl border border-slate-200 px-4 text-md focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    defaultValue={state.rawData?.endDate ?? subject.endDate?.toISOString().split('T')[0]}
                    aria-invalid={!!errors.endDate}
                    aria-describedby={errors.endDate ? 'subject-endDate-error' : undefined}
                />
                <div id="subject-endDate-error" className="text-red-600 text-sm" aria-live="polite" aria-atomic="true">
                    {errors.endDate?.map((message) => (
                        <p key={message}>{message}</p>
                    )) }
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()} 
                        className="flex justify-center items-center h-[50px] flex-1 rounded-xl border border-slate-200 font-medium hover:cursor-pointer">
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="h-[50px] flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 hover:cursor-pointer"
                        disabled={isPending}
                    >
                        {isPending ? 'Updating...' : 'Update subject'}
                    </button>
                </div>
            </form>
        </div>
    )
}