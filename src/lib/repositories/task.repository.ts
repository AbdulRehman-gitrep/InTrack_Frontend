import { Role } from "@/lib/types/role"
import type { Task, TaskStatus } from "@/lib/types/task"
import { mockTasks } from "@/lib/mock/tasks"
import { getUsersByRole } from "@/lib/mock/users"

let tasks = mockTasks.map((t) => ({ ...t }))

export function resetTaskRepository() {
  tasks = mockTasks.map((t) => ({ ...t }))
}

export const taskRepository = {
  async getTasks(): Promise<Task[]> {
    return tasks.map((t) => ({ ...t }))
  },

  async getTaskById(id: string): Promise<Task | undefined> {
    return tasks.find((t) => t.id === id)
  },

  async getTasksForIntern(internId: string): Promise<Task[]> {
    return tasks.filter((t) => t.assigneeId === internId).map((t) => ({ ...t }))
  },

  async getTasksForManager(managerId: string): Promise<Task[]> {
    return tasks.filter((t) => t.createdBy === managerId).map((t) => ({ ...t }))
  },

  async getTasksForBuddy(buddyId: string): Promise<Task[]> {
    const internIds = getUsersByRole(Role.INTERN)
      .filter((u) => u.buddyId === buddyId)
      .map((u) => u.id)
    return tasks.filter((t) => internIds.includes(t.assigneeId)).map((t) => ({ ...t }))
  },

  async createTask(data: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const newTask: Task = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split("T")[0],
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | undefined> {
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) return undefined
    tasks[index] = { ...tasks[index], status }
    return { ...tasks[index] }
  },
}
