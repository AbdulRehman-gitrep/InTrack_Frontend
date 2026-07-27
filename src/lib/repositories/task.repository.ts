import api from "@/lib/api/client"
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from "@/lib/types/task"

function mapTask(t: Record<string, unknown>): Task {
  return {
    id: t.id as number,
    title: t.title as string,
    description: (t.description as string) ?? null,
    status: t.status as TaskStatus,
    dueDate: t.dueDate as string,
    createdAt: t.createdAt as string,
    internId: (t.internId as number) ?? null,
    internName: (t.internName as string) ?? null,
    managerId: (t.managerId as number) ?? null,
    managerName: (t.managerName as string) ?? null,
  }
}

interface PaginatedResult {
  tasks: Task[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const taskRepository = {
  async getTasks(params?: Record<string, string | number | undefined>): Promise<PaginatedResult> {
    const response = await api.get("/tasks", { params })
    const { tasks, pagination } = response.data.data as {
      tasks: Record<string, unknown>[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }
    return { tasks: tasks.map(mapTask), pagination }
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`)
    return mapTask(response.data.data as Record<string, unknown>)
  },

  async createTask(data: CreateTaskPayload): Promise<Task> {
    const response = await api.post("/tasks", data)
    return mapTask(response.data.data as Record<string, unknown>)
  },

  async updateTask(id: number, data: UpdateTaskPayload): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, data)
    return mapTask(response.data.data as Record<string, unknown>)
  },

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/status`, { status })
    return mapTask(response.data.data as Record<string, unknown>)
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
