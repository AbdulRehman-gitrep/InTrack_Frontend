"use client"

import { useMemo, useState } from "react"
import type { Task, TaskStatus } from "@/lib/types/task"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  interns: User[]
  currentUserId: string
  onSave: (task: Omit<Task, "id" | "createdAt">) => void
}

export function TaskFormDialog({
  open,
  onOpenChange,
  interns,
  currentUserId,
  onSave,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const activeInterns = useMemo(
    () => interns.filter((u) => u.isActive),
    [interns],
  )

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = "Title is required."
    if (!assigneeId) next.assigneeId = "Select an intern."
    if (!dueDate) next.dueDate = "Due date is required."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      status: "assigned" as TaskStatus,
      assigneeId,
      createdBy: currentUserId,
      dueDate,
    })
    setTitle("")
    setDescription("")
    setAssigneeId("")
    setDueDate("")
    setErrors({})
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTitle("")
      setDescription("")
      setAssigneeId("")
      setDueDate("")
      setErrors({})
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to an intern.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up CI/CD pipeline"
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task requirements..."
              rows={3}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assign to</Label>
            <select
              id="assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an intern...</option>
              {activeInterns.map((intern) => (
                <option key={intern.id} value={intern.id}>
                  {intern.fullName} — {intern.department}
                </option>
              ))}
            </select>
            {errors.assigneeId && (
              <p className="text-xs text-red-600">{errors.assigneeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-600">{errors.dueDate}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Assign Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
