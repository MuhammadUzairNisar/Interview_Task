import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.message ?? res.statusText, body?.error?.details);
  }
  return body.data as T;
}

export const tasksApi = {
  list: (params?: { status?: TaskStatus; search?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v) as [string, string][],
    ).toString();
    return request<Task[]>(`/tasks${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<Task>(`/tasks/${id}`),
  create: (input: CreateTaskInput) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: UpdateTaskInput) =>
    request<Task>(`/tasks/${id}`, { method: "POST", body: JSON.stringify(input) }),
  remove: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
