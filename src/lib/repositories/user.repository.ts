import api from "@/lib/api/client"
import { Role } from "@/lib/types/role"
import type { User, CreateUserPayload, EditUserPayload } from "@/lib/types/user"

function mapUser(u: Record<string, unknown>): User {
  return {
    id: String(u.id),
    fullName: u.fullName as string,
    email: u.email as string,
    role: u.role as Role,
    department: u.department as string,
    isActive: u.isActive as boolean,
    managerId: u.managerId != null ? String(u.managerId) : null,
    managerName: (u.managerName as string) ?? null,
    buddyId: u.buddyId != null ? String(u.buddyId) : null,
    buddyName: (u.buddyName as string) ?? null,
    internshipStart: (u.internshipStart as string) ?? null,
    internshipEnd: (u.internshipEnd as string) ?? null,
    createdAt: u.createdAt as string,
  }
}

interface GetUsersParams {
  page?: number
  limit?: number
  role?: string
  department?: string
  status?: string
  search?: string
  managerId?: number
  buddyId?: number
}

interface PaginatedResult {
  users: User[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const userRepository = {
  async getUsers(params?: GetUsersParams): Promise<PaginatedResult> {
    const response = await api.get("/users", { params })
    const { users, pagination } = response.data.data as {
      users: Record<string, unknown>[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }
    return { users: users.map(mapUser), pagination }
  },

  async getUserById(id: string): Promise<User | undefined> {
    const response = await api.get(`/users/${id}`)
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async getUsersByRole(role: Role): Promise<User[]> {
    const result = await this.getUsers({ role: role.toUpperCase(), limit: 100 })
    return result.users
  },

  async getInternsByBuddy(buddyId: string): Promise<User[]> {
    const result = await this.getUsers({ role: "INTERN", limit: 100 })
    return result.users.filter((u) => u.buddyId === buddyId)
  },

  async getInternsByManager(managerId: string): Promise<User[]> {
    const result = await this.getUsers({ role: "INTERN", limit: 100 })
    return result.users.filter((u) => u.managerId === managerId)
  },

  async createUser(data: CreateUserPayload): Promise<User> {
    const body: Record<string, unknown> = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role.toUpperCase(),
      department: data.department,
    }
    if (data.internshipStart) body.internshipStart = data.internshipStart
    if (data.internshipEnd) body.internshipEnd = data.internshipEnd
    if (data.managerId) body.managerId = Number(data.managerId)
    if (data.buddyId) body.buddyId = Number(data.buddyId)
    const response = await api.post("/users", body)
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async updateUser(id: string, data: EditUserPayload): Promise<User | undefined> {
    const body: Record<string, unknown> = {
      fullName: data.fullName,
      email: data.email,
      department: data.department,
    }
    if (data.internshipStart !== undefined) body.internshipStart = data.internshipStart
    if (data.internshipEnd !== undefined) body.internshipEnd = data.internshipEnd
    if (data.managerId !== undefined) body.managerId = Number(data.managerId)
    if (data.buddyId !== undefined) body.buddyId = Number(data.buddyId)
    const response = await api.patch(`/users/${id}`, body)
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async updateProfile(data: EditUserPayload): Promise<User> {
    const response = await api.patch("/users/me/profile", {
      fullName: data.fullName,
      email: data.email,
      department: data.department,
    })
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async toggleUserStatus(id: string): Promise<User | undefined> {
    const user = await this.getUserById(id)
    if (!user) return undefined
    const status = user.isActive ? "INACTIVE" : "ACTIVE"
    const response = await api.patch(`/users/${id}/status`, { status })
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async assignRole(id: string, role: Role): Promise<User | undefined> {
    const response = await api.patch(`/users/${id}`, {
      role: role.toUpperCase(),
    })
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async assignManager(id: string, managerId: string | null): Promise<User | undefined> {
    const response = await api.patch(`/users/${id}`, {
      managerId: managerId ? Number(managerId) : null,
    })
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async assignBuddy(id: string, buddyId: string | null): Promise<User | undefined> {
    const response = await api.patch(`/users/${id}`, {
      buddyId: buddyId ? Number(buddyId) : null,
    })
    return mapUser(response.data.data as Record<string, unknown>)
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
