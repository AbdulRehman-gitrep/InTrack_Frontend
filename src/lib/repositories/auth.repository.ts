import api from "@/lib/api/client"
import type { User } from "@/lib/types/user"

interface ApiWrapper<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const authRepository = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data: wrapper } = await api.post<ApiWrapper<{ token: string; user: Partial<User> }>>("/auth/login", { email, password })
    return { token: wrapper.data.token, user: wrapper.data.user as User }
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },

  async getCurrentUser(): Promise<User> {
    const { data: wrapper } = await api.get<ApiWrapper<User>>("/auth/me")
    return wrapper.data
  },
}
