import api from "@/lib/api/client"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"

interface ApiWrapper<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

function mapSessionUser(u: Record<string, unknown>): User {
  return {
    id: String(u.id),
    fullName: u.fullName as string,
    email: u.email as string,
    role: u.role as Role,
    department: u.department as string,
    isActive: u.isActive as boolean,
    managerId: u.managerId != null ? String(u.managerId) : null,
    buddyId: u.buddyId != null ? String(u.buddyId) : null,
    internshipStart: (u.internshipStart as string) ?? null,
    internshipEnd: (u.internshipEnd as string) ?? null,
    createdAt: u.createdAt as string,
  }
}

export const authRepository = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data: wrapper } = await api.post<ApiWrapper<{ token: string; user: Record<string, unknown> }>>("/auth/login", { email, password })
    return { token: wrapper.data.token, user: mapSessionUser(wrapper.data.user) }
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },

  async getCurrentUser(): Promise<User> {
    const { data: wrapper } = await api.get<ApiWrapper<Record<string, unknown>>>("/auth/me")
    return mapSessionUser(wrapper.data)
  },
}
