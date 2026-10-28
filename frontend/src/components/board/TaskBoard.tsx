"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Plus, RotateCw, Search } from "lucide-react";
import { tasksApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { controlClass } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { TASK_PRIORITIES, TASK_STATUSES, type CreateTaskInput, type Task, type TaskPriority, type TaskStatus } from "@/types/task";
import { BoardColumn } from "./BoardColumn";
import { PRIORITY_META } from "./meta";
import { TaskFormDialog, type TaskFormState } from "./TaskFormDialog";

const nextPosition = (tasks: Task[], status: TaskStatus) =>
  Math.max(-1, ...tasks.filter((t) => t.status === status).map((t) => t.position)) + 1;

export function TaskBoard() {
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [form, setForm] = useState<TaskFormState>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    tasksApi
      .list()
      .then((data) => !ignore && setTasks(data))
      .catch((err) => !ignore && setLoadError(err instanceof Error ? err.message : "Failed to load tasks"))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function retry() {
    setLoading(true);
    setLoadError(null);
    setReloadKey((k) => k + 1);
  }

  const filtered = query.trim() !== "" || priorityFilter !== "all";
  const columns = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = tasks.filter(
      (t) =>
        (priorityFilter === "all" || t.priority === priorityFilter) &&
        (!q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)),
    );
    return Object.fromEntries(
      TASK_STATUSES.map((s) => [s, visible.filter((t) => t.status === s).sort((a, b) => a.position - b.position)]),
    ) as Record<TaskStatus, Task[]>;
  }, [tasks, query, priorityFilter]);

  const doneCount = tasks.filter((t) => t.status === "done").length;

  async function handleSubmit(input: CreateTaskInput) {
    if (form?.mode === "edit") {
      const { task } = form;
      const moved = input.status && input.status !== task.status;
      const updated = await tasksApi.update(task.id, {
        ...input,
        ...(moved && { position: nextPosition(tasks, input.status!) }),
      });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast("Task updated");
    } else {
      const created = await tasksApi.create(input);
      setTasks((prev) => [...prev, created]);
      toast("Task created");
    }
    setForm(null);
  }

  async function handleMove(task: Task, status: TaskStatus) {
    const position = nextPosition(tasks, status);
    const snapshot = tasks;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status, position } : t)));
    try {
      const updated = await tasksApi.update(task.id, { status, position });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch {
      setTasks(snapshot);
      toast("Couldn't move the task. Please try again.", "error");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await tasksApi.remove(pendingDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== pendingDelete.id));
      toast("Task deleted");
      setPendingDelete(null);
    } catch {
      toast("Couldn't delete the task. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading your board…"
              : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} · ${doneCount} completed`}
          </p>
        </div>
        <Button onClick={() => setForm({ mode: "create", status: "todo" })} className="sm:self-auto">
          <Plus className="size-4" aria-hidden />
          New task
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <label htmlFor="task-search" className="sr-only">
            Search tasks
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <input
            id="task-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            className={`${controlClass} h-10 pl-9`}
          />
        </div>
        <div>
          <label htmlFor="priority-filter" className="sr-only">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "all")}
            className={`${controlClass} h-10 cursor-pointer sm:w-44`}
          >
            <option value="all">All priorities</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label} priority
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <BoardSkeleton />
      ) : loadError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-card">
          <span className="flex size-10 items-center justify-center rounded-full bg-destructive-soft">
            <AlertTriangle className="size-5 text-destructive" aria-hidden />
          </span>
          <div>
            <p className="font-semibold">Couldn&apos;t load your tasks</p>
            <p className="mt-1 text-sm text-muted-foreground">{loadError}. Check that the API is running.</p>
          </div>
          <Button variant="secondary" onClick={retry}>
            <RotateCw className="size-4" aria-hidden />
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-3">
          {TASK_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={columns[status]}
              filtered={filtered}
              onAdd={(s) => setForm({ mode: "create", status: s })}
              onEdit={(task) => setForm({ mode: "edit", task })}
              onMove={handleMove}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <TaskFormDialog state={form} onClose={() => setForm(null)} onSubmit={handleSubmit} />

      <Dialog
        open={pendingDelete !== null}
        onClose={() => !deleting && setPendingDelete(null)}
        title="Delete task?"
        description={pendingDelete ? `"${pendingDelete.title}" will be removed from the board.` : undefined}
        size="sm"
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setPendingDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Delete task
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-hidden>
      {[3, 2, 1].map((count, i) => (
        <div key={i} className="rounded-2xl border border-border bg-muted/80 p-3">
          <div className="mb-4 ml-1 h-4 w-24 rounded bg-border-strong/60 motion-safe:animate-pulse" />
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: count }, (_, j) => (
              <div key={j} className="h-28 rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="h-3.5 w-3/4 rounded bg-border-strong/60 motion-safe:animate-pulse" />
                <div className="mt-2.5 h-3 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
                <div className="mt-6 h-5 w-16 rounded bg-muted motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
