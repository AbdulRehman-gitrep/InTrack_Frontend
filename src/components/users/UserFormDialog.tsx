"use client"

import { useState } from "react"
import { Role } from "@/lib/types/role"
import type { User, CreateUserPayload, EditUserPayload } from "@/lib/types/user"

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

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (data: CreateUserPayload | EditUserPayload) => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
  const isEditing = !!user
  const [fullName, setFullName] = useState(user?.fullName ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(user?.role ?? Role.INTERN)
  const [department, setDepartment] = useState(user?.department ?? "")
  const [internshipStart, setInternshipStart] = useState(user?.internshipStart ?? "")
  const [internshipEnd, setInternshipEnd] = useState(user?.internshipEnd ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = "Full name is required."
    if (!email.trim()) next.email = "Email is required."
    else if (!emailRegex.test(email)) next.email = "Enter a valid email address."
    if (!isEditing && !password) next.password = "Password is required."
    else if (!isEditing && password.length < 6) next.password = "Password must be at least 6 characters."
    if (!department.trim()) next.department = "Department is required."
    if (internshipStart && internshipEnd && internshipEnd < internshipStart) {
      next.internshipEnd = "End date must be after start date."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (isEditing) {
      onSave({
        fullName: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
        internshipStart: internshipStart || undefined,
        internshipEnd: internshipEnd || undefined,
      } as EditUserPayload)
    } else {
      onSave({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        department: department.trim(),
        internshipStart: internshipStart || undefined,
        internshipEnd: internshipEnd || undefined,
      } as CreateUserPayload)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user details below."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isEditing}
            >
              <option value={Role.ADMIN}>Administrator</option>
              <option value={Role.MANAGER}>Line Manager</option>
              <option value={Role.BUDDY}>Buddy</option>
              <option value={Role.INTERN}>Intern</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            {errors.department && (
              <p className="text-xs text-red-600">{errors.department}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="internshipStart">Start Date</Label>
              <Input
                id="internshipStart"
                type="date"
                value={internshipStart}
                onChange={(e) => setInternshipStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internshipEnd">End Date</Label>
              <Input
                id="internshipEnd"
                type="date"
                value={internshipEnd}
                onChange={(e) => setInternshipEnd(e.target.value)}
              />
              {errors.internshipEnd && (
                <p className="text-xs text-red-600">{errors.internshipEnd}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{isEditing ? "Save Changes" : "Create User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
