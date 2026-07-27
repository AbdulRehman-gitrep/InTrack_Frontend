import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/lib/types/task"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-gray-100 text-gray-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}
