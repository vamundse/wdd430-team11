'use client';

import Link from 'next/link';
import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createTask, type TaskFormState } from '@/lib/task-actions';
import type { SubjectOption } from '@/lib/tasks';

const inputClass =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 aria-invalid:border-red-400';

const initialState: TaskFormState = { errors: {}, message: null };

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((message) => (
        <p key={message} className="mt-1 text-sm text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}

function TaskForm({
  subjects,
  onSuccess,
  onCancel,
}: {
  subjects: SubjectOption[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(createTask, initialState);
  const values = state.values;
  const errors = state.errors ?? {};

  // When the action says it worked, close the modal
  useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          placeholder="Ex: Chapter 4 reading"
          defaultValue={values?.title}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby="title-error"
          className={inputClass}
        />
        <FieldError id="title" errors={errors.title} />
      </div>

      <div>
        <label htmlFor="task-subject" className="mb-1 block text-sm font-medium text-slate-700">
          Subject
        </label>
        <select
          id="task-subject"
          name="subjectId"
          defaultValue={values?.subjectId ?? ''}
          aria-invalid={errors.subjectId ? true : undefined}
          aria-describedby="subjectId-error"
          className={inputClass}
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label}
            </option>
          ))}
        </select>
        <FieldError id="subjectId" errors={errors.subjectId} />
      </div>

      <div>
        <label htmlFor="task-priority" className="mb-1 block text-sm font-medium text-slate-700">
          Priority
        </label>
        <select
          id="task-priority"
          name="priority"
          defaultValue={values?.priority ?? 'medium'}
          aria-invalid={errors.priority ? true : undefined}
          aria-describedby="priority-error"
          className={inputClass}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <FieldError id="priority" errors={errors.priority} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-date" className="mb-1 block text-sm font-medium text-slate-700">
            Due date
          </label>
          <input
            id="task-date"
            name="dueDate"
            type="date"
            defaultValue={values?.dueDate}
            aria-invalid={errors.dueDate ? true : undefined}
            aria-describedby="dueDate-error"
            className={inputClass}
          />
          <FieldError id="dueDate" errors={errors.dueDate} />
        </div>
        <div>
          <label htmlFor="task-time" className="mb-1 block text-sm font-medium text-slate-700">
            Time
          </label>
          <input
            id="task-time"
            name="dueTime"
            type="time"
            defaultValue={values?.dueTime ?? '23:59'}
            aria-invalid={errors.dueTime ? true : undefined}
            aria-describedby="dueTime-error"
            className={inputClass}
          />
          <FieldError id="dueTime" errors={errors.dueTime} />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save task'}
        </button>
      </div>
    </form>
  );
}

export default function NewTaskModal({ subjects }: { subjects: SubjectOption[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Changing the key gives the form a fresh start (empty fields, no old errors)
  const [formKey, setFormKey] = useState(0);

  function openModal() {
    setFormKey((key) => key + 1);
    dialogRef.current?.showModal();
  }

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New task
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="new-task-heading"
        aria-describedby="new-task-description"
        // A click on the dark backdrop lands on the <dialog> itself: close it
        onClick={(event) => {
          if (event.target === dialogRef.current) closeModal();
        }}
        className="m-auto w-full max-w-md rounded-2xl bg-white p-0 shadow-xl backdrop:bg-slate-900/50"
      >
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="new-task-heading" className="text-lg font-semibold text-slate-900">
                New task
              </h2>
              <p id="new-task-description" className="text-sm text-slate-500">
                Add an assignment, reading, or study session.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {subjects.length === 0 ? (
            <p className="text-sm text-slate-600">
              Every task belongs to a subject.{' '}
              <Link href="/subjects" className="font-medium text-blue-600 underline">
                Create a subject first
              </Link>
              .
            </p>
          ) : (
            <TaskForm
              key={formKey}
              subjects={subjects}
              onSuccess={closeModal}
              onCancel={closeModal}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
