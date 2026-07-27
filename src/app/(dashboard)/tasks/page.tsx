"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, ChevronLeft, ChevronRight, Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskStatusBadge } from "@/components/common/TaskStatusBadge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TasksTable } from "@/components/tasks/TasksTable"
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog"

import type { Task, TaskStatus } from "@/lib/types/task"
import { Role } from "@/lib/types/role"
import { useSession } from "@/lib/context/session"
import { taskRepository } from "@/lib/repositories/task.repository"

const statusOptions: { value: TaskStatus | ""; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
]

const internStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
]

function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {["Task", "Assigned Intern", "Assigned By", "Due Date", "Status"].map((h) => (
              <th key={h} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b last:border-b-0">
              {Array.from({ length: 5 }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TasksPage() {
  const { user } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("")

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const isManager = user.role === Role.MANAGER
  const isIntern = user.role === Role.INTERN
  const isAdmin = user.role === Role.ADMIN
  const canManage = isManager || isAdmin

  const loadTasks = useCallback(async () => {
    setLoading(true)
    const params: Record<string, string | number> = { page, limit }
    if (debouncedSearch) params.search = debouncedSearch
    if (statusFilter) params.status = statusFilter
    const result = await taskRepository.getTasks(params)
    setTasks(result.tasks)
    setTotalPages(result.pagination.totalPages)
    setTotal(result.pagination.total)
    setLoading(false)
  }, [page, debouncedSearch, statusFilter])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  async function handleCreateTask(data: {
    title: string
    description?: string
    internId: number
    dueDate: string
  }) {
    const created = await taskRepository.createTask(data)
    if (page === 1) {
      setTasks((prev) => [created, ...prev])
    }
    setFormOpen(false)
  }

  async function handleUpdateTask(data: {
    title: string
    description?: string
    internId: number
    dueDate: string
  }) {
    if (!editingTask) return
    const updated = await taskRepository.updateTask(editingTask.id, data)
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setEditingTask(null)
    setFormOpen(false)
  }

  async function handleDeleteTask(task: Task) {
    if (!confirm(`Delete task "${task.title}"?`)) return
    await taskRepository.deleteTask(task.id)
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  async function handleStatusChange(taskId: number, status: TaskStatus) {
    const updated = await taskRepository.updateTaskStatus(taskId, status)
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  function openEditDialog(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function openCreateDialog() {
    setEditingTask(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isIntern ? "My Tasks" : "Tasks"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isIntern
              ? "Tasks assigned to you. Update their status as you progress."
              : "Manage tasks assigned to interns."}
          </p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Assign Task
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {total > 0 && (
          <p className="text-sm text-muted-foreground">
            {total} task{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {loading ? (
        isIntern ? (
          <CardSkeleton rows={3} />
        ) : (
          <TableSkeleton rows={5} />
        )
      ) : isIntern ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">
                    {task.title}
                  </CardTitle>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </div>
                <TaskStatusBadge status={task.status} />
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {task.managerName && (
                    <>
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                          {task.managerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>Assigned by {task.managerName}</span>
                    </>
                  )}
                  <span className="mx-1">•</span>
                  <span>
                    Due{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(task.id, e.target.value as TaskStatus)
                  }
                  className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {internStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          ))}
          {tasks.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tasks assigned to you.
            </p>
          )}
        </div>
      ) : (
        <>
          <TasksTable
            tasks={tasks}
            onEdit={canManage ? openEditDialog : undefined}
            onDelete={canManage ? handleDeleteTask : undefined}
          />
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {canManage && (
        <TaskFormDialog
          open={formOpen}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null)
            setFormOpen(open)
          }}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          editingTask={editingTask}
          currentUserId={user.id}
          currentUserRole={user.role}
        />
      )}
    </div>
  )
}
