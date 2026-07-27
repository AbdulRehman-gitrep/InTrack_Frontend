"use client"

import { useMemo, useState, useEffect } from "react"
import { Role } from "@/lib/types/role"
import type { User } from "@/lib/types/user"

import { Input } from "@/components/ui/input"
import { TableSkeleton } from "@/components/ui/skeleton"
import { UsersTable } from "@/components/users/UsersTable"

import { useSession } from "@/lib/context/session"
import { userRepository } from "@/lib/repositories/user.repository"

export default function InternsPage() {
  const { user } = useSession()
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      setLoading(true)
      const params: Record<string, string | number> = { role: Role.INTERN.toUpperCase() }
      if (user.role === Role.MANAGER) {
        params.managerId = Number(user.id)
      }
      if (user.role === Role.BUDDY) {
        params.buddyId = Number(user.id)
      }
      const { users } = await userRepository.getUsers(params)
      setAllUsers(users)
      setLoading(false)
    }
    load()
  }, [user.id, user.role])

  const interns = allUsers

  const filtered = useMemo(
    () =>
      interns.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.department.toLowerCase().includes(search.toLowerCase()),
      ),
    [interns, search],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Interns</h1>
        <p className="text-sm text-muted-foreground">
          Interns assigned to you.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search interns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {interns.length} interns
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <UsersTable
          users={filtered}
          role={user.role}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleActive={() => {}}
          onAssignRole={() => {}}
          onAssignManager={() => {}}
          onAssignBuddy={() => {}}
        />
      )}
    </div>
  )
}
