"use client"

import { useMemo } from "react"
import { Calendar, User } from "lucide-react"

import { TaskStatusBadge } from "@/components/common/TaskStatusBadge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { Task } from "@/lib/types/task"
import type { User as UserType } from "@/lib/types/user"

interface TasksTableProps {
  tasks: Task[]
  users: UserType[]
}

export function TasksTable({ tasks, users }: TasksTableProps) {
  const userMap = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  )

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const assignee = userMap.get(task.assigneeId)
        return (
          <Card key={task.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">
                  {task.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {task.description}
                </p>
              </div>
              <TaskStatusBadge status={task.status} />
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {assignee ? (
                  <>
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                        {assignee.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{assignee.fullName}</span>
                  </>
                ) : (
                  <span className="flex items-center gap-1">
                    <User className="size-3.5" />
                    Unassigned
                  </span>
                )}
                <span className="mx-1.5">•</span>
                <Calendar className="size-3.5" />
                <span>Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
      {tasks.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No tasks found.
        </p>
      )}
    </div>
  )
}
