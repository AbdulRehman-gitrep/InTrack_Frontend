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
      const loaded = await userRepository.getUsers()
      setAllUsers(loaded)
      setLoading(false)
    }
    load()
  }, [])

  const interns = useMemo<User[]>(() => {
    const all = allUsers.filter((u) => u.role === Role.INTERN)
    if (user.role === Role.BUDDY) {
      return all.filter((u) => u.buddyId === user.id)
    }
    return all
  }, [allUsers, user.id, user.role])

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
          onToggleActive={() => {}}
          onAssignRole={() => {}}
          onAssignManager={() => {}}
          onAssignBuddy={() => {}}
        />
      )}
    </div>
  )
}
