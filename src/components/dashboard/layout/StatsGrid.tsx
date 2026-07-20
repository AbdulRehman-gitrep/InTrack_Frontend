import type { ReactNode } from "react"

interface StatsGridProps {
  children: ReactNode
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  )
}
