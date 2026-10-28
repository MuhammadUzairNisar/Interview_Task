"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { TASK_PRIORITIES, TASK_STATUSES, type CreateTaskInput, type Task, type TaskPriority, type TaskStatus } from "@/types/task";
import { PRIORITY_META, STATUS_META } from "./meta";

export type TaskFormState = { mode: "create"; status: TaskStatus } | { mode: "edit"; task: Task } | null;

interface Props {
  state: TaskFormState;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

export function TaskFormDialog({ state, onClose, onSubmit }: Props) {
  const editing = state?.mode === "edit";
  return (
    <Dialog
      open={state !== null}
      onClose={onClose}
      title={editing ? "Edit task" : "New task"}
      description={editing ? "Update the details of this task." : "Add a task to your board."}
    >
      {state && <TaskForm state={state} onCancel={onClose} onSubmit={onSubmit} />}
    </Dialog>
  );
}

function TaskForm({
  state,
  onCancel,
  onSubmit,
}: {
  state: NonNullable<TaskFormState>;
  onCancel: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}) {
  const task = state.mode === "edit" ? state.task : null;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? (state.mode === "create" ? state.status : "todo"));
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    setSubmitting(true);
    setErrors({});
    setFormError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        dueDate: dueDate || null,
      });
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])));
      } else {
        setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field id="task-title" label="Title" required error={errors.title}>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Write API documentation"
          maxLength={200}
          autoFocus
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "task-title-error" : undefined}
        />
      </Field>

      <Field id="task-description" label="Description" error={errors.description} hint="Optional">
        <Textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more context for this task"
          maxLength={5000}
          aria-invalid={!!errors.description}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="task-status" label="Status" error={errors.status}>
          <Select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="task-priority" label="Priority" error={errors.priority}>
          <Select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="task-due" label="Due date" error={errors.dueDate}>
          <Input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-invalid={!!errors.dueDate}
          />
        </Field>
      </div>

      {formError && (
        <p role="alert" className="rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {task ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
