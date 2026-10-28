"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Task, TaskStatus } from "@/types/task";
import { STATUS_META } from "./meta";
import { TaskCard } from "./TaskCard";

interface Props {
  status: TaskStatus;
  tasks: Task[];
  filtered: boolean;
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

export function BoardColumn({ status, tasks, filtered, onAdd, onEdit, onMove, onDelete }: Props) {
  const meta = STATUS_META[status];
  const headingId = `column-${status}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col rounded-2xl border border-border bg-muted/80 p-3">
      <header className="mb-3 flex items-center justify-between pl-1">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${meta.dot}`} aria-hidden />
          <h2 id={headingId} className="text-sm font-semibold">
            {meta.label}
          </h2>
          <span className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground ring-1 ring-border">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onAdd(status)} aria-label={`Add task to ${meta.label}`}>
          <Plus className="size-4" aria-hidden />
        </Button>
      </header>

      {tasks.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} onEdit={onEdit} onMove={onMove} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">{filtered ? "No tasks match your filters." : meta.empty}</p>
          {!filtered && (
            <button
              type="button"
              onClick={() => onAdd(status)}
              className="cursor-pointer rounded text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Add a task
            </button>
          )}
        </div>
      )}
    </section>
  );
}
