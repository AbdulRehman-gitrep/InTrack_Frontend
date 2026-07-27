"use client"

import { useState, useEffect } from "react"
import { BrainCircuit, Code2, Database, GraduationCap, Users, type LucideIcon } from "lucide-react"

import { CardSkeleton } from "@/components/ui/skeleton"
import { DepartmentCard } from "@/components/dashboard/cards/DepartmentCard"
import { StatCard } from "@/components/dashboard/cards/StatCard"
import { DashboardSection } from "@/components/dashboard/layout/DashboardSection"
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader"
import { StatsGrid } from "@/components/dashboard/layout/StatsGrid"
import { dashboardRepository } from "@/lib/repositories/dashboard.repository"
import { useSession } from "@/lib/context/session"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const DEPARTMENT_CONFIG: Record<string, { icon: LucideIcon; iconColor: string; iconBackground: string; titleClassName: string; accentBorderClassName: string }> = {
  "Software Engineering": { icon: Code2, iconColor: "text-blue-600", iconBackground: "bg-blue-100", titleClassName: "text-blue-600", accentBorderClassName: "border-t-[3px] border-blue-500" },
  "AI/ML": { icon: BrainCircuit, iconColor: "text-violet-600", iconBackground: "bg-violet-100", titleClassName: "text-violet-600", accentBorderClassName: "border-t-[3px] border-violet-500" },
  "Data Engineering": { icon: Database, iconColor: "text-orange-600", iconBackground: "bg-orange-100", titleClassName: "text-orange-600", accentBorderClassName: "border-t-[3px] border-orange-500" },
}

const DEFAULT_DEPT = { icon: Users, iconColor: "text-slate-600", iconBackground: "bg-slate-100", titleClassName: "text-slate-600", accentBorderClassName: "border-t-[3px] border-slate-500" }

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-8 w-16" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  )
}

export function AdminDashboard({ userName: _userName }: { userName?: string }) {
  const { user } = useSession()
  const displayName = _userName || user.fullName || "User"
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalUsers: 0, activeInterns: 0, departmentStats: [] as { title: string; count: number }[] })

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await dashboardRepository.getAdminStats()
      setStats(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <DashboardHeader
        userName={displayName}
        tagline="Here&apos;s what is happening across the internship portal today."
        label="System Overview"
      />

      <DashboardSection title="Overview">
        <StatsGrid>
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                description="Registered users"
                icon={Users}
                iconColor="text-blue-700"
                iconBackground="bg-blue-100"
                valueClassName="text-blue-700"
                titleClassName="text-blue-700"
                accentBorderClassName="border-t-[3px] border-blue-500"
              />
              <StatCard
                title="Active Interns"
                value={stats.activeInterns}
                description="Active interns"
                icon={GraduationCap}
                iconColor="text-emerald-600"
                iconBackground="bg-emerald-100"
                valueClassName="text-emerald-600"
                titleClassName="text-emerald-600"
                accentBorderClassName="border-t-[3px] border-emerald-500"
              />
            </>
          )}
        </StatsGrid>
      </DashboardSection>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Department Overview</h2>
          <p className="text-sm text-slate-500">
            Distribution of interns across internship departments.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.departmentStats.map((dept) => {
              const cfg = DEPARTMENT_CONFIG[dept.title] ?? DEFAULT_DEPT
              return (
                <DepartmentCard
                  key={dept.title}
                  title={dept.title}
                  count={dept.count}
                  icon={cfg.icon}
                  iconColor={cfg.iconColor}
                  iconBackground={cfg.iconBackground}
                  titleClassName={cfg.titleClassName}
                  accentBorderClassName={cfg.accentBorderClassName}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
