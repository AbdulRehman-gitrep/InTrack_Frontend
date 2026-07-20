import { cn } from "@/lib/utils"

type TaskStatus = "assigned" | "in_progress" | "completed" | "pending"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  assigned: {
    label: "Assigned",
    className: "bg-blue-100 text-blue-700",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
  pending: {
    label: "Pending",
    className: "bg-red-100 text-red-700",
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
