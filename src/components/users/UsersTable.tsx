"use client"

import { Edit, EllipsisVertical, EyeOff, RotateCcw, Shield, UserCog, UserPlus } from "lucide-react"
import { useMemo } from "react"
import { Role } from "@/lib/types/role"
import type { User } from "@/lib/types/user"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UsersTableProps {
  users: User[]
  role?: Role
  onEdit: (user: User) => void
  onToggleActive: (userId: string) => void
  onAssignRole: (user: User) => void
  onAssignManager: (user: User) => void
  onAssignBuddy: (user: User) => void
}

const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.MANAGER]: "Manager",
  [Role.BUDDY]: "Buddy",
  [Role.INTERN]: "Intern",
}

const roleBadgeColors: Record<Role, string> = {
  [Role.ADMIN]: "bg-purple-100 text-purple-700",
  [Role.MANAGER]: "bg-blue-100 text-blue-700",
  [Role.BUDDY]: "bg-amber-100 text-amber-700",
  [Role.INTERN]: "bg-green-100 text-green-700",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function UsersTable({
  users,
  role,
  onEdit,
  onToggleActive,
  onAssignRole,
  onAssignManager,
  onAssignBuddy,
}: UsersTableProps) {
  const isAdmin = role === Role.ADMIN
  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 ">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Manager</th>
            <th className="px-4 py-3">Buddy</th>
            <th className="px-4 py-3">Status</th>
            {isAdmin && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const manager = user.managerId ? userMap.get(user.managerId) : null
            const buddy = user.buddyId ? userMap.get(user.buddyId) : null

            return (
              <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeColors[user.role]}`}
                  >
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.department}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {manager?.fullName ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {buddy?.fullName ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm">
                            <EllipsisVertical className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        {user.role !== Role.INTERN && (
                          <DropdownMenuItem onClick={() => onAssignRole(user)}>
                            <Shield className="size-4" />
                            Assign Role
                          </DropdownMenuItem>
                        )}
                        {user.role === Role.INTERN && (
                          <>
                            <DropdownMenuItem onClick={() => onAssignManager(user)}>
                              <UserCog className="size-4" />
                              Assign Manager
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAssignBuddy(user)}>
                              <UserPlus className="size-4" />
                              Assign Buddy
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onToggleActive(user.id)}>
                          {user.isActive ? (
                            <>
                              <EyeOff className="size-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <RotateCcw className="size-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
          No users found.
        </div>
      )}
    </div>
  )
}
