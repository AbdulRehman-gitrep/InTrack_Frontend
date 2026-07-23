"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react"
import { Role } from "@/lib/types/role"
import type { User, CreateUserPayload, EditUserPayload } from "@/lib/types/user"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableSkeleton } from "@/components/ui/skeleton"
import { AssignRelationshipSheet } from "@/components/users/AssignRelationshipSheet"
import { AssignRoleSheet } from "@/components/users/AssignRoleSheet"
import { UserFormDialog } from "@/components/users/UserFormDialog"
import { UsersTable } from "@/components/users/UsersTable"

import { userRepository } from "@/lib/repositories/user.repository"
import { useSession } from "@/lib/context/session"

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.MANAGER, label: "Manager" },
  { value: Role.BUDDY, label: "Buddy" },
  { value: Role.INTERN, label: "Intern" },
]

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
]

export default function UsersPage() {
  const { user: currentUser } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [userFormOpen, setUserFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [roleSheetUser, setRoleSheetUser] = useState<User | null>(null)
  const [managerSheetUser, setManagerSheetUser] = useState<User | null>(null)
  const [buddySheetUser, setBuddySheetUser] = useState<User | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const params: Record<string, string | number> = { page, limit }
    if (debouncedSearch) params.search = debouncedSearch
    if (roleFilter) params.role = roleFilter.toUpperCase()
    if (statusFilter) params.status = statusFilter
    const result = await userRepository.getUsers(params)
    setUsers(result.users)
    setTotalPages(result.pagination.totalPages)
    setTotal(result.pagination.total)
    setLoading(false)
  }, [page, debouncedSearch, roleFilter, statusFilter])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  async function handleCreate(data: CreateUserPayload | EditUserPayload) {
    const payload = data as CreateUserPayload
    const created = await userRepository.createUser(payload)
    setUsers((prev) => [...prev, created])
    setTotal((prev) => prev + 1)
    setUserFormOpen(false)
  }

  async function handleEdit(data: CreateUserPayload | EditUserPayload) {
    if (!editingUser) return
    const payload = data as EditUserPayload
    const updated = await userRepository.updateUser(editingUser.id, payload)
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? updated : u)),
      )
    }
    setEditingUser(null)
    setUserFormOpen(false)
  }

  async function handleToggleActive(userId: string) {
    const updated = await userRepository.toggleUserStatus(userId)
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updated : u)),
      )
    }
  }

  async function handleAssignRole(userId: string, role: Role) {
    const updated = await userRepository.assignRole(userId, role)
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updated : u)),
      )
    }
    setRoleSheetUser(null)
  }

  async function handleAssignManager(userId: string, managerId: string | null) {
    const updated = await userRepository.assignManager(userId, managerId)
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updated : u)),
      )
    }
    setManagerSheetUser(null)
  }

  async function handleAssignBuddy(userId: string, buddyId: string | null) {
    const updated = await userRepository.assignBuddy(userId, buddyId)
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updated : u)),
      )
    }
    setBuddySheetUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users, roles, and assignments.
          </p>
        </div>
        <Button onClick={() => setUserFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create User
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
        >
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <>
          <UsersTable
            users={users}
            role={currentUser.role}
            onEdit={(user) => {
              setEditingUser(user)
              setUserFormOpen(true)
            }}
            onToggleActive={handleToggleActive}
            onAssignRole={setRoleSheetUser}
            onAssignManager={setManagerSheetUser}
            onAssignBuddy={setBuddySheetUser}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <UserFormDialog
        open={userFormOpen}
        onOpenChange={(open) => {
          setUserFormOpen(open)
          if (!open) setEditingUser(null)
        }}
        user={editingUser}
        onSave={editingUser ? handleEdit : handleCreate}
      />

      {roleSheetUser && (
        <AssignRoleSheet
          open={!!roleSheetUser}
          onOpenChange={(open) => { if (!open) setRoleSheetUser(null) }}
          user={roleSheetUser}
          onAssign={handleAssignRole}
        />
      )}

      {managerSheetUser && (
        <AssignRelationshipSheet
          open={!!managerSheetUser}
          onOpenChange={(open) => { if (!open) setManagerSheetUser(null) }}
          user={managerSheetUser}
          type="manager"
          onAssign={handleAssignManager}
        />
      )}

      {buddySheetUser && (
        <AssignRelationshipSheet
          open={!!buddySheetUser}
          onOpenChange={(open) => { if (!open) setBuddySheetUser(null) }}
          user={buddySheetUser}
          type="buddy"
          onAssign={handleAssignBuddy}
        />
      )}
    </div>
  )
}
