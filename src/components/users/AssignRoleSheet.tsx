"use client"

import { useState } from "react"
import { Role } from "@/lib/types/role"
import type { User } from "@/lib/types/user"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface AssignRoleSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onAssign: (userId: string, role: Role) => void
}

export function AssignRoleSheet({ open, onOpenChange, user, onAssign }: AssignRoleSheetProps) {
  const [role, setRole] = useState<Role>(user.role)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAssign(user.id, role)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Assign Role</SheetTitle>
          <SheetDescription>
            Change the role for <span className="font-medium text-foreground">{user.fullName}</span>.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 p-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="assign-role">Role</Label>
            <select
              id="assign-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={Role.ADMIN}>Administrator</option>
              <option value={Role.MANAGER}>Line Manager</option>
              <option value={Role.BUDDY}>Buddy</option>
              <option value={Role.INTERN}>Intern</option>
            </select>
          </div>

          <SheetFooter className="px-0">
            <Button type="submit">Save Role</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
