"use client"

import { useState, useMemo, useEffect } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateCardSkeleton } from "@/components/ui/skeleton"
import { UpdateCard } from "@/components/updates/UpdateCard"

import { useSession } from "@/lib/context/session"

import type { WeeklyReport } from "@/lib/types/update"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { reportRepository } from "@/lib/repositories/report.repository"
import { userRepository } from "@/lib/repositories/user.repository"

function getWeekRange(): { start: string; end: string } {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
  }
}

export default function WeeklyReportsPage() {
  const { user } = useSession()
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const isIntern = user.role === Role.INTERN

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [loadedReports, loadedUsers] = await Promise.all([
        reportRepository.getWeeklyReports(),
        userRepository.getUsers(),
      ])
      setReports(loadedReports)
      setAllUsers(loadedUsers)
      setLoading(false)
    }
    load()
  }, [])

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers])

  const visibleReports = useMemo(() => {
    if (isIntern) {
      return [...reports]
        .filter((r) => r.internId === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
    const internIds = allUsers
      .filter(
        (u) =>
          u.role === Role.INTERN && u.managerId === user.id,
      )
      .map((u) => u.id)
    return [...reports]
      .filter((r) => internIds.includes(r.internId))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [reports, allUsers, user.id, isIntern])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError("Write your report before submitting.")
      return
    }
    const { start, end } = getWeekRange()
    const created = await reportRepository.submitWeeklyReport({
      internId: user.id,
      weekStart: start,
      weekEnd: end,
      content: content.trim(),
    })
    setReports((prev) => [created, ...prev])
    setContent("")
    setError("")
  }

  async function handleToggleReview(reportId: string) {
    const updated = await reportRepository.markReportReviewed(reportId)
    if (updated) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? updated : r,
        ),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Weekly Reports</h1>
        <p className="text-sm text-muted-foreground">
          {isIntern
            ? "Submit your weekly report and view your history."
            : "Review weekly reports from your interns."}
        </p>
      </div>

      {isIntern && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit This Week&apos;s Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Summarize your work this week: what you accomplished, challenges faced, and plans for next week."
                  rows={5}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
              <Button type="submit">
                <Send className="mr-1.5 size-4" />
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {isIntern ? "Report History" : "Intern Reports"} ({visibleReports.length})
        </h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <UpdateCardSkeleton key={i} />
            ))}
          </>
        ) : (
          visibleReports.map((report) => (
            <UpdateCard
              key={report.id}
              author={userMap.get(report.internId)!}
              dateLabel={`${new Date(report.weekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(report.weekEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
              title="Weekly Report"
              content={report.content}
              isReviewed={report.isReviewed}
              onToggleReview={
                isIntern ? undefined : () => handleToggleReview(report.id)
              }
            />
          ))
        )}
        {!loading && visibleReports.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isIntern
              ? "No reports submitted yet."
              : "No reports from your interns."}
          </p>
        )}
      </div>
    </div>
  )
}
