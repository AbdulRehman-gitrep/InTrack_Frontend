"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Role } from "@/lib/types/role"
import type { User, CreateUserPayload, EditUserPayload } from "@/lib/types/user"

import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/skeleton"
import { AssignRelationshipSheet } from "@/components/users/AssignRelationshipSheet"
import { AssignRoleSheet } from "@/components/users/AssignRoleSheet"
import { UserFormDialog } from "@/components/users/UserFormDialog"
import { UsersTable } from "@/components/users/UsersTable"

import { userRepository } from "@/lib/repositories/user.repository"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [userFormOpen, setUserFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [roleSheetUser, setRoleSheetUser] = useState<User | null>(null)
  const [managerSheetUser, setManagerSheetUser] = useState<User | null>(null)
  const [buddySheetUser, setBuddySheetUser] = useState<User | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const loaded = await userRepository.getUsers()
      setUsers(loaded)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCreate(data: CreateUserPayload | EditUserPayload) {
    const payload = data as CreateUserPayload
    const created = await userRepository.createUser(payload)
    setUsers((prev) => [...prev, created])
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

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <UsersTable
          users={users}
          onEdit={(user) => {
            setEditingUser(user)
            setUserFormOpen(true)
          }}
          onToggleActive={handleToggleActive}
          onAssignRole={setRoleSheetUser}
          onAssignManager={setManagerSheetUser}
          onAssignBuddy={setBuddySheetUser}
        />
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
