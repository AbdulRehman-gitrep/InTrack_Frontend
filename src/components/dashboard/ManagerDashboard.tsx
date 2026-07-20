"use client"

import { useState, useEffect } from "react"
import { CalendarDays, ClipboardCheck, Clock, ListTodo, Users } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/dashboard/cards/StatCard"
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader"
import { DashboardSection } from "@/components/dashboard/layout/DashboardSection"
import { StatsGrid } from "@/components/dashboard/layout/StatsGrid"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useSession } from "@/lib/context/session"
import { dashboardRepository } from "@/lib/repositories/dashboard.repository"
import type { User } from "@/lib/types/user"

interface ManagerDashboardProps {
  userName?: string
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
        {value}/{max}
      </span>
    </div>
  )
}

function InternProgressCard({
  intern,
  tasksCompleted,
  totalTasks,
  updatesReviewed,
  totalUpdates,
  reportsReviewed,
  totalReports,
}: {
  intern: { fullName: string; department: string }
  tasksCompleted: number
  totalTasks: number
  updatesReviewed: number
  totalUpdates: number
  reportsReviewed: number
  totalReports: number
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-blue-100 text-sm text-blue-700">
            {intern.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-sm font-semibold">{intern.fullName}</CardTitle>
          <p className="text-xs text-muted-foreground">{intern.department}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ListTodo className="size-3.5" />
            Tasks Completed
          </div>
          <ProgressBar value={tasksCompleted} max={totalTasks} color="bg-blue-500" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Daily Updates Reviewed
          </div>
          <ProgressBar value={updatesReviewed} max={totalUpdates} color="bg-amber-500" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClipboardCheck className="size-3.5" />
            Weekly Reports Reviewed
          </div>
          <ProgressBar value={reportsReviewed} max={totalReports} color="bg-emerald-500" />
        </div>
      </CardContent>
    </Card>
  )
}

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

function InternProgressCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ManagerDashboard({ userName = "User" }: ManagerDashboardProps) {
  const { user: currentUser } = useSession()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<{
    intern: User
    tasksCompleted: number
    totalTasks: number
    updatesReviewed: number
    totalUpdates: number
    reportsReviewed: number
    totalReports: number
  }[]>([])

  const [stats, setStats] = useState({
    assignedInterns: 0,
    activeTasks: 0,
    pendingUpdates: 0,
    pendingReports: 0,
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [loadedStats, loadedProgress] = await Promise.all([
        dashboardRepository.getManagerStats(currentUser.id),
        dashboardRepository.getManagerInternProgress(currentUser.id),
      ])
      setStats(loadedStats)
      setProgress(loadedProgress)
      setLoading(false)
    }
    load()
  }, [currentUser.id])

  return (
    <div className="space-y-8">
      <DashboardHeader
        userName={userName}
        tagline="Manage your interns and review their progress."
        label="Manager Overview"
      />

      <DashboardSection title="Overview">
        <StatsGrid>
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Assigned Interns"
                value={stats.assignedInterns}
                description="Currently mentoring"
                icon={Users}
                iconColor="text-blue-700"
                iconBackground="bg-blue-100"
                valueClassName="text-blue-700"
                titleClassName="text-blue-700"
                accentBorderClassName="border-t-[3px] border-blue-500"
              />
              <StatCard
                title="Pending Daily Updates"
                value={stats.pendingUpdates}
                description="Awaiting review"
                icon={CalendarDays}
                iconColor="text-amber-600"
                iconBackground="bg-amber-100"
                valueClassName="text-amber-600"
                titleClassName="text-amber-600"
                accentBorderClassName="border-t-[3px] border-amber-500"
              />
              <StatCard
                title="Active Tasks"
                value={stats.activeTasks}
                description="Assigned to interns"
                icon={Clock}
                iconColor="text-blue-700"
                iconBackground="bg-blue-100"
                valueClassName="text-blue-700"
                titleClassName="text-blue-700"
                accentBorderClassName="border-t-[3px] border-blue-500"
              />
              <StatCard
                title="Pending Reports"
                value={stats.pendingReports}
                description="Weekly reports to review"
                icon={ClipboardCheck}
                iconColor="text-red-600"
                iconBackground="bg-red-100"
                valueClassName="text-red-600"
                titleClassName="text-red-600"
                accentBorderClassName="border-t-[3px] border-red-500"
              />
            </>
          )}
        </StatsGrid>
      </DashboardSection>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Intern Progress</h2>
          <p className="text-sm text-slate-500">
            Task completion, update reviews, and report reviews per intern.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <InternProgressCardSkeleton key={i} />
            ))}
          </div>
        ) : progress.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {progress.map((p) => (
              <InternProgressCard
                key={p.intern.id}
                intern={p.intern}
                tasksCompleted={p.tasksCompleted}
                totalTasks={p.totalTasks}
                updatesReviewed={p.updatesReviewed}
                totalUpdates={p.totalUpdates}
                reportsReviewed={p.reportsReviewed}
                totalReports={p.totalReports}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No interns assigned to you yet.
          </p>
        )}
      </section>
    </div>
  )
}
