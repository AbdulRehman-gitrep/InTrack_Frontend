import { Role } from "@/lib/types/role"
import type { User, CreateUserPayload, EditUserPayload } from "@/lib/types/user"
import { mockUsers, getUserById, getUsersByRole } from "@/lib/mock/users"

function cloneUsers(): User[] {
  return mockUsers.map((u) => ({ ...u }))
}

let users = cloneUsers()

export function resetUserRepository() {
  users = cloneUsers()
}

export const userRepository = {
  async getUsers(): Promise<User[]> {
    return users.map((u) => ({ ...u }))
  },

  async getUserById(id: string): Promise<User | undefined> {
    return users.find((u) => u.id === id)
  },

  async getUsersByRole(role: Role): Promise<User[]> {
    return users.filter((u) => u.role === role).map((u) => ({ ...u }))
  },

  async getInternsByBuddy(buddyId: string): Promise<User[]> {
    return users.filter((u) => u.role === Role.INTERN && u.buddyId === buddyId)
  },

  async getInternsByManager(managerId: string): Promise<User[]> {
    return users.filter((u) => u.role === Role.INTERN && u.managerId === managerId)
  },

  async createUser(data: CreateUserPayload): Promise<User> {
    const newUser: User = {
      id: String(users.length + 1),
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      department: data.department,
      isActive: true,
      managerId: null,
      buddyId: null,
      internshipStart: data.internshipStart ?? null,
      internshipEnd: data.internshipEnd ?? null,
      createdAt: new Date().toISOString().split("T")[0],
    }
    users.push(newUser)
    return { ...newUser }
  },

  async updateUser(id: string, data: EditUserPayload): Promise<User | undefined> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    users[index] = {
      ...users[index],
      fullName: data.fullName,
      email: data.email,
      department: data.department,
      internshipStart: data.internshipStart ?? users[index].internshipStart,
      internshipEnd: data.internshipEnd ?? users[index].internshipEnd,
    }
    return { ...users[index] }
  },

  async toggleUserStatus(id: string): Promise<User | undefined> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    users[index] = { ...users[index], isActive: !users[index].isActive }
    return { ...users[index] }
  },

  async assignRole(id: string, role: Role): Promise<User | undefined> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    users[index] = { ...users[index], role }
    return { ...users[index] }
  },

  async assignManager(id: string, managerId: string | null): Promise<User | undefined> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    users[index] = { ...users[index], managerId }
    return { ...users[index] }
  },

  async assignBuddy(id: string, buddyId: string | null): Promise<User | undefined> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    users[index] = { ...users[index], buddyId }
    return { ...users[index] }
  },
}
