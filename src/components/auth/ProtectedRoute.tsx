"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/context/session"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading, authenticated } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/login")
    }
  }, [loading, authenticated, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
