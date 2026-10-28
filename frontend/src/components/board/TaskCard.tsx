"use client";

import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TASK_STATUSES, type Task, type TaskStatus } from "@/types/task";
import { PRIORITY_META, STATUS_META, formatDueDate, todayISO } from "./meta";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onMove, onDelete }: Props) {
  const priority = PRIORITY_META[task.priority];
  const PriorityIcon = priority.icon;
  const overdue = task.dueDate !== null && task.status !== "done" && task.dueDate < todayISO();

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className={`cursor-pointer rounded text-left text-sm font-semibold leading-snug transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${task.status === "done" ? "text-muted-foreground line-through decoration-border-strong" : "text-foreground"}`}
        >
          {task.title}
        </button>
        <div className="-mr-1.5 -mt-1 flex shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
            <Pencil className="size-3.5" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
            className="hover:bg-destructive-soft hover:text-destructive"
          >
            <Trash2 className="size-3.5" aria-hidden />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${priority.badge}`}
        >
          <PriorityIcon className="size-3" aria-hidden />
          {priority.label}
        </span>

        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${overdue ? "text-destructive" : "text-subtle"}`}
          >
            <CalendarDays className="size-3.5" aria-hidden />
            {overdue && "Overdue · "}
            <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
          </span>
        )}

        <label className="ml-auto">
          <span className="sr-only">Move {task.title} to</span>
          <select
            value={task.status}
            onChange={(e) => onMove(task, e.target.value as TaskStatus)}
            className="h-8 cursor-pointer rounded-md border border-border bg-card px-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-border-strong focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}
