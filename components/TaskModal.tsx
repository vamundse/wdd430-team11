'use client';

import Link from 'next/link';
import { useActionState, useCallback, useEffect, useId, useRef, useState } from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import {
  createTask,
  updateTask,
  type TaskFormState,
  type TaskFormValues,
} from '@/lib/task-actions';
import type { SubjectOption, TaskListItem } from '@/lib/tasks';

const inputClass =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 aria-invalid:border-red-400';

const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

const initialState: TaskFormState = { errors: {}, message: null };

type FormAction = (prevState: TaskFormState, formData: FormData) => Promise<TaskFormState>;

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((message) => (
        <p key={message} className="mt-1 text-sm text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}

// Turns a saved task into the text values the form fields expect
function valuesFromTask(task: TaskListItem): TaskFormValues {
  return {
    title: task.title,
    subjectId: task.subjectId,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate.slice(0, 10), // "2026-10-10"
    dueTime: task.dueDate.slice(11, 16), // "23:59"
  };
}

function TaskForm({
  subjects,
  action,
  initialValues,
  isEditing,
  onSuccess,
  onCancel,
}: {
  subjects: SubjectOption[];
  action: FormAction;
  initialValues?: Partial<TaskFormValues>;
  isEditing: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  // After an error, show what the user typed; otherwise the saved task (edit) or blanks (new)
  const values = state.values ?? initialValues;
  const errors = state.errors ?? {};
  // Unique prefix, because the page has one modal per task plus the "New task" one
  const id = useId();

  // When the action says it worked, close the modal
  useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor={`${id}-title`} className={labelClass}>
          Title
        </label>
        <input
          id={`${id}-title`}
          name="title"
          type="text"
          placeholder="Ex: Chapter 4 reading"
          defaultValue={values?.title}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={`${id}-title-error`}
          className={inputClass}
        />
        <FieldError id={`${id}-title-error`} errors={errors.title} />
      </div>

      <div>
        <label htmlFor={`${id}-subject`} className={labelClass}>
          Subject
        </label>
        <select
          id={`${id}-subject`}
          name="subjectId"
          defaultValue={values?.subjectId ?? ''}
          aria-invalid={errors.subjectId ? true : undefined}
          aria-describedby={`${id}-subject-error`}
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
        <FieldError id={`${id}-subject-error`} errors={errors.subjectId} />
      </div>

      <div className={isEditing ? 'grid grid-cols-2 gap-3' : undefined}>
        <div>
          <label htmlFor={`${id}-priority`} className={labelClass}>
            Priority
          </label>
          <select
            id={`${id}-priority`}
            name="priority"
            defaultValue={values?.priority ?? 'medium'}
            aria-invalid={errors.priority ? true : undefined}
            aria-describedby={`${id}-priority-error`}
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <FieldError id={`${id}-priority-error`} errors={errors.priority} />
        </div>

        {/* New tasks always start as pending, so status only shows when editing */}
        {isEditing && (
          <div>
            <label htmlFor={`${id}-status`} className={labelClass}>
              Status
            </label>
            <select
              id={`${id}-status`}
              name="status"
              defaultValue={values?.status ?? 'pending'}
              aria-invalid={errors.status ? true : undefined}
              aria-describedby={`${id}-status-error`}
              className={inputClass}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <FieldError id={`${id}-status-error`} errors={errors.status} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-date`} className={labelClass}>
            Due date
          </label>
          <input
            id={`${id}-date`}
            name="dueDate"
            type="date"
            defaultValue={values?.dueDate}
            aria-invalid={errors.dueDate ? true : undefined}
            aria-describedby={`${id}-date-error`}
            className={inputClass}
          />
          <FieldError id={`${id}-date-error`} errors={errors.dueDate} />
        </div>
        <div>
          <label htmlFor={`${id}-time`} className={labelClass}>
            Time
          </label>
          <input
            id={`${id}-time`}
            name="dueTime"
            type="time"
            defaultValue={values?.dueTime ?? '23:59'}
            aria-invalid={errors.dueTime ? true : undefined}
            aria-describedby={`${id}-time-error`}
            className={inputClass}
          />
          <FieldError id={`${id}-time-error`} errors={errors.dueTime} />
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
          {isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Save task'}
        </button>
      </div>
    </form>
  );
}

// One modal for both jobs:
//   <TaskModal subjects={...} />              -> "New task" button, creates a task
//   <TaskModal subjects={...} task={task} />  -> pencil button, edits that task
export default function TaskModal({
  subjects,
  task,
  defaultSubjectId,
}: {
  subjects: SubjectOption[];
  task?: TaskListItem;
  defaultSubjectId?: string;
}) {
  const isEditing = task !== undefined;
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The form only exists while the modal is open, so every opening starts fresh
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  function openModal() {
    setIsOpen(true);
    dialogRef.current?.showModal();
  }

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Edit mode: pre-fill the task id, so the form only sends the fields (same idea as bind in a page)
  const action: FormAction = isEditing ? updateTask.bind(null, task.id) : createTask;

  return (
    <>
      {isEditing ? (
        <button
          type="button"
          onClick={openModal}
          aria-label={`Edit "${task.title}"`}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New task
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-heading`}
        aria-describedby={`${id}-description`}
        // Runs however the modal closes: X, Cancel, Esc, backdrop or after saving
        onClose={() => setIsOpen(false)}
        // A click on the dark backdrop lands on the <dialog> itself: close it
        onClick={(event) => {
          if (event.target === dialogRef.current) closeModal();
        }}
        className="m-auto w-full max-w-md rounded-2xl bg-white p-0 shadow-xl backdrop:bg-slate-900/50"
      >
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={`${id}-heading`} className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit task' : 'New task'}
              </h2>
              <p id={`${id}-description`} className="text-sm text-slate-500">
                {isEditing
                  ? 'Update the details of this task.'
                  : 'Add an assignment, reading, or study session.'}
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
            isOpen && (
              <TaskForm
                subjects={subjects}
                action={action}
                initialValues={isEditing ? valuesFromTask(task) : { subjectId: defaultSubjectId ?? '' }}
                isEditing={isEditing}
                onSuccess={closeModal}
                onCancel={closeModal}
              />
            )
          )}
        </div>
      </dialog>
    </>
  );
}
