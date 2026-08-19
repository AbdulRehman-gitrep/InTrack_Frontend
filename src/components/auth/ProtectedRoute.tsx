"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "@/lib/context/session"
import { Role } from "@/lib/types/role"

const routeRoles: Record<string, Role[]> = {
  "/dashboard": [Role.ADMIN, Role.MANAGER, Role.BUDDY, Role.INTERN],
  "/users": [Role.ADMIN],
  "/interns": [Role.ADMIN, Role.MANAGER, Role.BUDDY],
  "/tasks": [Role.MANAGER, Role.BUDDY, Role.INTERN],
  "/reports": [Role.MANAGER, Role.BUDDY, Role.INTERN],
  "/feedback": [Role.MANAGER, Role.BUDDY, Role.INTERN],
  "/activity": [Role.ADMIN, Role.MANAGER],
  "/profile": [Role.ADMIN, Role.MANAGER, Role.BUDDY, Role.INTERN],
}

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading, authenticated, role } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const allowedRoles = routeRoles[pathname]
  const authorized = !allowedRoles || allowedRoles.includes(role)

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/login")
    } else if (!loading && authenticated && !authorized) {
      router.replace("/dashboard")
    }
  }, [loading, authenticated, authorized, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!authenticated || !authorized) {
    return null
  }

  return <>{children}</>
}
