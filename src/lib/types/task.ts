export type TaskStatus = "assigned" | "in_progress" | "completed" | "pending"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assigneeId: string
  createdBy: string
  createdAt: string
  dueDate: string
}
