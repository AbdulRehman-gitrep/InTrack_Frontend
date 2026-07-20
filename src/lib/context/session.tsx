"use client"

import { createContext, useContext, useCallback } from "react"

import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { mockSession } from "@/lib/mock/session"

interface Session {
  user: User
  role: Role
  login: (token: string) => void
  logout: () => void
}

const SessionContext = createContext<Session | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const user = mockSession.user

  const login = useCallback((_token: string) => {
    
  }, [])

  const logout = useCallback(() => {
    
  }, [])

  return (
    <SessionContext.Provider value={{ user, role: user.role, login, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): Session {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return ctx
}
