"use client"

import { useState, useEffect, useMemo } from "react"
import type { Task } from "@/lib/types/task"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { userRepository } from "@/lib/repositories/user.repository"

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
  onSave: (data: { title: string; description?: string; internId: number; dueDate: string }) => Promise<void>
  editingTask?: Task | null
  currentUserId?: string
  currentUserRole?: string
}

export function TaskFormDialog({
  open,
  onOpenChange,
  onSave,
  editingTask,
  currentUserId,
  currentUserRole,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [internId, setInternId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [interns, setInterns] = useState<User[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const activeInterns = useMemo(
    () => interns.filter((u) => u.isActive),
    [interns],
  )

  useEffect(() => {
    if (!open) return
    const params: Record<string, string | number> = { role: Role.INTERN.toUpperCase() }
    if (currentUserRole === Role.MANAGER && currentUserId) {
      params.managerId = Number(currentUserId)
    }
    userRepository.getUsers(params).then((r) => setInterns(r.users))
  }, [open, currentUserRole, currentUserId])

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description ?? "")
      setInternId(String(editingTask.internId ?? ""))
      setDueDate(editingTask.dueDate)
    } else {
      setTitle("")
      setDescription("")
      setInternId("")
      setDueDate("")
    }
    setErrors({})
  }, [editingTask, open])

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = "Title is required."
    if (!internId) next.internId = "Select an intern."
    if (!dueDate) next.dueDate = "Due date is required."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      internId: Number(internId),
      dueDate,
    })
    setSaving(false)
    if (!editingTask) {
      setTitle("")
      setDescription("")
      setInternId("")
      setDueDate("")
    }
    setErrors({})
    onOpenChange(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTitle("")
      setDescription("")
      setInternId("")
      setDueDate("")
      setErrors({})
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Task" : "Assign Task"}</DialogTitle>
          <DialogDescription>
            {editingTask
              ? "Update the task details."
              : "Create a new task and assign it to an intern."}
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
            <Label htmlFor="internId">Assign to</Label>
            <select
              id="internId"
              value={internId}
              onChange={(e) => setInternId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an intern...</option>
              {activeInterns.map((intern) => (
                <option key={intern.id} value={intern.id}>
                  {intern.fullName} — {intern.department}
                </option>
              ))}
            </select>
            {errors.internId && (
              <p className="text-xs text-red-600">{errors.internId}</p>
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
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingTask ? "Save Changes" : "Assign Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
