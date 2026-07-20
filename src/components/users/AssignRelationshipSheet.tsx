"use client"

import { useState, useEffect } from "react"
import { Role } from "@/lib/types/role"
import type { User } from "@/lib/types/user"
import { userRepository } from "@/lib/repositories/user.repository"

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

interface AssignRelationshipSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  type: "manager" | "buddy"
  onAssign: (userId: string, targetId: string | null) => void
}

export function AssignRelationshipSheet({
  open,
  onOpenChange,
  user,
  type,
  onAssign,
}: AssignRelationshipSheetProps) {
  const targetRole = type === "manager" ? Role.MANAGER : Role.BUDDY
  const [candidates, setCandidates] = useState<User[]>([])

  const currentId = type === "manager" ? user.managerId : user.buddyId
  const [selectedId, setSelectedId] = useState(currentId ?? "none")

  useEffect(() => {
    async function load() {
      const users = await userRepository.getUsersByRole(targetRole)
      setCandidates(users.filter((u) => u.id !== user.id && u.isActive))
    }
    load()
  }, [user.id, targetRole])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAssign(user.id, selectedId === "none" ? null : selectedId)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Assign {type === "manager" ? "Manager" : "Buddy"}</SheetTitle>
          <SheetDescription>
            Assign a {type} to <span className="font-medium text-foreground">{user.fullName}</span>.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 p-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="assign-target">{type === "manager" ? "Manager" : "Buddy"}</Label>
            <select
              id="assign-target"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="none">None</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.fullName} — {candidate.department}
                </option>
              ))}
            </select>
            {candidates.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No {type === "manager" ? "managers" : "buddies"} available.
              </p>
            )}
          </div>

          <SheetFooter className="px-0">
            <Button type="submit">Save</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
