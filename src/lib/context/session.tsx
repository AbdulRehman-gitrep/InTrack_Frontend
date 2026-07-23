"use client"

import { createContext, useContext, useCallback, useState, useEffect } from "react"

import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { authRepository } from "@/lib/repositories/auth.repository"

const PLACEHOLDER_USER: User = {
  id: "",
  fullName: "",
  email: "",
  role: Role.INTERN,
  department: "",
  isActive: false,
  managerId: null,
  buddyId: null,
  internshipStart: null,
  internshipEnd: null,
  createdAt: "",
}

interface Session {
  user: User
  role: Role
  login: (token: string) => void
  logout: () => void
  loading: boolean
  authenticated: boolean
}

const SessionContext = createContext<Session>({
  user: PLACEHOLDER_USER,
  role: Role.INTERN,
  login: () => {},
  logout: () => {},
  loading: true,
  authenticated: false,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(PLACEHOLDER_USER)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      authRepository
        .getCurrentUser()
        .then((u) => {
          setUser(u)
          setAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem("accessToken")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback((token: string) => {
    localStorage.setItem("accessToken", token)
    setAuthenticated(true)
    setLoading(true)
    authRepository.getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem("accessToken")
        setAuthenticated(false)
      })
      .finally(() => setLoading(false))
  }, [])

  const logout = useCallback(() => {
    authRepository.logout().catch(() => {})
    localStorage.removeItem("accessToken")
    setUser(PLACEHOLDER_USER)
    setAuthenticated(false)
  }, [])

  return (
    <SessionContext.Provider value={{ user, role: user.role, login, logout, loading, authenticated }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): Session {
  return useContext(SessionContext)
}
