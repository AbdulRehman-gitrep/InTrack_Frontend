import type { TaskStatus } from "@/lib/types/task"

export interface CreateTaskDto {
  title: string
  description: string
  assigneeId: string
  createdBy: string
  dueDate: string
}

export interface UpdateTaskDto {
  status: TaskStatus
}
