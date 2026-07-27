export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED"

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string
  createdAt: string
  internId: number | null
  internName: string | null
  managerId: number | null
  managerName: string | null
}

export interface CreateTaskPayload {
  title: string
  description?: string
  internId: number
  dueDate: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  internId?: number
  dueDate?: string
}
