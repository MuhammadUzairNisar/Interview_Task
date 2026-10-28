import { ArrowDown, ArrowUp, Equal, type LucideIcon } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/types/task";

export const STATUS_META: Record<TaskStatus, { label: string; dot: string; empty: string }> = {
  todo: { label: "To do", dot: "bg-subtle", empty: "Nothing queued up. Add a task to get started." },
  in_progress: { label: "In progress", dot: "bg-amber-500", empty: "No work in flight right now." },
  done: { label: "Done", dot: "bg-emerald-500", empty: "Completed tasks will show up here." },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; icon: LucideIcon; badge: string }> = {
  low: { label: "Low", icon: ArrowDown, badge: "bg-muted text-muted-foreground ring-border" },
  medium: { label: "Medium", icon: Equal, badge: "bg-amber-50 text-amber-800 ring-amber-200" },
  high: { label: "High", icon: ArrowUp, badge: "bg-red-50 text-red-700 ring-red-200" },
};

export const todayISO = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

export const formatDueDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
