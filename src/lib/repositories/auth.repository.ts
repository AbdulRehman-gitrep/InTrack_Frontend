import type { User } from "@/lib/types/user"
import { mockSession } from "@/lib/mock/session"

export const authRepository = {
  async login(_email: string, _password: string): Promise<{ user: User; token: string }> {
    return {
      user: mockSession.user,
      token: "mock-token",
    }
  },

  async logout(): Promise<void> {
    
  },

  async getCurrentUser(): Promise<User> {
    return mockSession.user
  },
}
