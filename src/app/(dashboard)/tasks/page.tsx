"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskStatusBadge } from "@/components/common/TaskStatusBadge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TasksTable } from "@/components/tasks/TasksTable"
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog"

import type { Task, TaskStatus } from "@/lib/types/task"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { useSession } from "@/lib/context/session"
import { taskRepository } from "@/lib/repositories/task.repository"
import { userRepository } from "@/lib/repositories/user.repository"

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

function TaskCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </CardContent>
    </Card>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {["Task", "Status", "Assignee", "Due", "Priority"].map((h) => (
              <th key={h} className="px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </td>
              {Array.from({ length: 4 }).map((_, c) => (
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
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [interns, setInterns] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const isManager = user.role === Role.MANAGER
  const isBuddy = user.role === Role.BUDDY
  const isIntern = user.role === Role.INTERN

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [loadedTasks, loadedUsers] = await Promise.all([
        taskRepository.getTasks(),
        userRepository.getUsers(),
      ])
      setTasks(loadedTasks)
      setAllUsers(loadedUsers)
      setInterns(loadedUsers.filter((u) => u.role === Role.INTERN && u.isActive))
      setLoading(false)
    }
    load()
  }, [])

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers])

  const visibleTasks = useMemo(() => {
    if (isIntern) {
      return tasks.filter((t) => t.assigneeId === user.id)
    }
    if (isManager) {
      return tasks.filter((t) => t.createdBy === user.id)
    }
    if (isBuddy) {
      const internIds = allUsers
        .filter((u) => u.buddyId === user.id)
        .map((u) => u.id)
      return tasks.filter((t) => internIds.includes(t.assigneeId))
    }
    return tasks
  }, [tasks, allUsers, user.id, isIntern, isManager, isBuddy])

  const filtered = useMemo(
    () =>
      visibleTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [visibleTasks, search],
  )

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    const updated = await taskRepository.updateTaskStatus(taskId, status)
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
    }
  }

  async function handleCreateTask(data: Omit<Task, "id" | "createdAt">) {
    const created = await taskRepository.createTask(data)
    setTasks((prev) => [created, ...prev])
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isIntern ? "My Tasks" : isManager ? "Assigned Tasks" : "Intern Tasks"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isIntern
              ? "Tasks assigned to you. Update their status as you progress."
              : isManager
                ? "Tasks you have assigned to interns."
                : "Tasks assigned to your interns."}
          </p>
        </div>
        {isManager && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 size-4" />
            Assign Task
          </Button>
        )}
      </div>

      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        isIntern ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={4} />
        )
      ) : isIntern ? (
        <div className="space-y-3">
          {filtered.map((task) => {
            const creator = userMap.get(task.createdBy)
            return (
              <Card key={task.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                      {task.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {creator && (
                      <>
                        <Avatar className="size-6">
                          <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                            {creator.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>Assigned by {creator.fullName}</span>
                      </>
                    )}
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value as TaskStatus)
                    }
                    className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tasks assigned to you.
            </p>
          )}
        </div>
      ) : (
        <TasksTable tasks={filtered} users={allUsers} />
      )}

      {isManager && (
        <TaskFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          interns={interns}
          currentUserId={user.id}
          onSave={handleCreateTask}
        />
      )}
    </div>
  )
}
