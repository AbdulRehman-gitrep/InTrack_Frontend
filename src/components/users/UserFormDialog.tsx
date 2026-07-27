"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
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

import { userRepository } from "@/lib/repositories/user.repository"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (data: CreateUserPayload | EditUserPayload) => void
  error?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function UserFormDialog({ open, onOpenChange, user, onSave, error }: UserFormDialogProps) {
  const isEditing = !!user
  const [fullName, setFullName] = useState(user?.fullName ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(user?.role ?? Role.INTERN)
  const [department, setDepartment] = useState(user?.department ?? "")
  const [internshipStart, setInternshipStart] = useState(user?.internshipStart ?? "")
  const [internshipEnd, setInternshipEnd] = useState(user?.internshipEnd ?? "")
  const [managerId, setManagerId] = useState(user?.managerId ?? "")
  const [buddyId, setBuddyId] = useState(user?.buddyId ?? "")
  const [showPassword, setShowPassword] = useState(false)
  const [managers, setManagers] = useState<User[]>([])
  const [buddies, setBuddies] = useState<User[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isIntern = role === Role.INTERN

  useEffect(() => {
    if (!open) return
    setFullName(user?.fullName ?? "")
    setEmail(user?.email ?? "")
    setPassword("")
    setRole(user?.role ?? Role.INTERN)
    setDepartment(user?.department ?? "")
    setInternshipStart(user?.internshipStart ?? "")
    setInternshipEnd(user?.internshipEnd ?? "")
    setManagerId(user?.managerId ?? "")
    setBuddyId(user?.buddyId ?? "")
    setErrors({})
    setShowPassword(false)
    if (!user || user.role === Role.INTERN) {
      Promise.all([
        userRepository.getUsersByRole(Role.MANAGER),
        userRepository.getUsersByRole(Role.BUDDY),
      ]).then(([m, b]) => {
        setManagers(m)
        setBuddies(b)
      })
    }
  }, [open])

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = "Full name is required."
    if (!email.trim()) next.email = "Email is required."
    else if (!emailRegex.test(email)) next.email = "Enter a valid email address."
    if (!isEditing && !password) next.password = "Password is required."
    else if (!isEditing && password.length < 6) next.password = "Password must be at least 6 characters."
    if (!department.trim()) next.department = "Department is required."
    if (isIntern && internshipStart && internshipEnd && internshipEnd < internshipStart) {
      next.internshipEnd = "End date must be after start date."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function buildPayload() {
    const internFields = isIntern
      ? {
          internshipStart: internshipStart || undefined,
          internshipEnd: internshipEnd || undefined,
          managerId: managerId || undefined,
          buddyId: buddyId || undefined,
        }
      : {}

    if (isEditing) {
      return {
        fullName: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
        ...internFields,
      } as EditUserPayload
    }
    return {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      role,
      department: department.trim(),
      ...internFields,
    } as CreateUserPayload
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSave(buildPayload())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user details below."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* dummy fields to trap browser autofill */}
          <input type="email" name="email_dummy" autoComplete="off" className="hidden" readOnly />
          <input type="password" name="password_dummy" autoComplete="off" className="hidden" readOnly />

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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
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
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select Department</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="QA">QA</option>
              <option value="Business Analyst">Business Analyst</option>
            </select>
            {errors.department && (
              <p className="text-xs text-red-600">{errors.department}</p>
            )}
          </div>

          {isIntern && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="internshipStart">Internship Start Date</Label>
                  <Input
                    id="internshipStart"
                    type="date"
                    value={internshipStart}
                    onChange={(e) => setInternshipStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internshipEnd">Internship End Date</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerId">Manager</Label>
                  <select
                    id="managerId"
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Manager</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buddyId">Buddy</Label>
                  <select
                    id="buddyId"
                    value={buddyId}
                    onChange={(e) => setBuddyId(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Buddy</option>
                    {buddies.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save Changes" : "Create User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
