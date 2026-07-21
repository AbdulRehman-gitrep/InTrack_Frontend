"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReportCardSkeleton } from "@/components/ui/skeleton"
import { ReportCard } from "@/components/reports/ReportCard"
import { ReportDetailsModal } from "@/components/reports/ReportDetailsModal"
import { ReportForm } from "@/components/reports/ReportForm"
import { EmptyReportsState } from "@/components/reports/EmptyReportsState"

import { useSession } from "@/lib/context/session"

import type { Attachment, Report } from "@/lib/types/update"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { reportRepository } from "@/lib/repositories/report.repository"
import { userRepository } from "@/lib/repositories/user.repository"

export default function ReportsPage() {
  const { user } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [viewingReport, setViewingReport] = useState<Report | null>(null)
  const [filterIntern, setFilterIntern] = useState<string>("all")
  const [searchDate, setSearchDate] = useState("")
  const isIntern = user.role === Role.INTERN
  const isManager = user.role === Role.MANAGER

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [loadedReports, loadedUsers] = await Promise.all([
        reportRepository.getReports(),
        userRepository.getUsers(),
      ])
      setReports(loadedReports)
      setAllUsers(loadedUsers)
      setLoading(false)
    }
    load()
  }, [])

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers])

  const internUsers = useMemo(
    () => allUsers.filter((u) => u.role === Role.INTERN),
    [allUsers],
  )

  const visibleReports = useMemo(() => {
    let filtered = [...reports]

    if (isIntern) {
      filtered = filtered.filter((r) => r.internId === user.id)
    } else {
      const internIds = allUsers
        .filter(
          (u) =>
            u.role === Role.INTERN &&
            (u.managerId === user.id || u.buddyId === user.id),
        )
        .map((u) => u.id)
      filtered = filtered.filter((r) => internIds.includes(r.internId))
    }

    if (isManager && filterIntern !== "all") {
      filtered = filtered.filter((r) => r.internId === filterIntern)
    }

    if (isManager && searchDate) {
      filtered = filtered.filter(
        (r) => r.createdAt.split("T")[0] === searchDate,
      )
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [reports, allUsers, user.id, isIntern, isManager, filterIntern, searchDate])

  async function handleCreateReport(data: { title: string; description: string; attachments: Attachment[] }) {
    const created = await reportRepository.submitReport({
      internId: user.id,
      title: data.title,
      description: data.description,
      attachments: data.attachments,
    })
    setReports((prev) => [created, ...prev])
    setShowForm(false)
  }

  async function handleUpdateReport(data: { title: string; description: string; attachments: Attachment[] }) {
    if (!editingReport) return
    const updated = await reportRepository.updateReport(editingReport.id, data)
    if (updated) {
      setReports((prev) =>
        prev.map((r) => (r.id === editingReport.id ? updated : r)),
      )
    }
    setEditingReport(null)
  }

  async function handleDelete(reportId: string) {
    await reportRepository.deleteReport(reportId)
    setReports((prev) => prev.filter((r) => r.id !== reportId))
  }

  async function handleToggleReview(reportId: string) {
    const updated = await reportRepository.markReportReviewed(reportId)
    if (updated) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? updated : r)),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            {isIntern
              ? "Submit your reports and view your history."
              : isManager
                ? "Review reports from your interns."
                : "View reports from your interns."}
          </p>
        </div>
        {isIntern && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-1.5 size-4" />
            New Report
          </Button>
        )}
      </div>

      {isIntern && showForm && (
        <ReportForm
          onSubmit={async (data) => {
            const created = await reportRepository.submitReport({
              internId: user.id,
              title: data.title,
              description: data.description,
              attachments: data.attachments,
            })
            setReports((prev) => [created, ...prev])
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {isIntern && editingReport && (
        <ReportForm
          initialTitle={editingReport.title}
          initialDescription={editingReport.description}
          initialAttachments={editingReport.attachments}
          onSubmit={async (data) => {
            const updated = await reportRepository.updateReport(editingReport.id, data)
            if (updated) {
              setReports((prev) =>
                prev.map((r) => (r.id === editingReport.id ? updated : r)),
              )
            }
            setEditingReport(null)
          }}
          onCancel={() => setEditingReport(null)}
          submitLabel="Save Changes"
          title="Edit Report"
        />
      )}

      {isManager && (
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Filter by Intern
            </label>
            <select
              value={filterIntern}
              onChange={(e) => setFilterIntern(e.target.value)}
              className="flex h-9 w-48 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Interns</option>
              {internUsers
                .filter((u) => u.managerId === user.id)
                .map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.fullName}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Filter by Date
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="flex h-9 w-48 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <ReportCardSkeleton key={i} />
            ))}
          </>
        ) : visibleReports.length > 0 ? (
          visibleReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              authorName={userMap.get(report.internId)?.fullName ?? "Unknown"}
              onView={() => setViewingReport(report)}
            />
          ))
        ) : (
          <EmptyReportsState
            isIntern={isIntern}
            onCreateReport={() => setShowForm(true)}
          />
        )}
      </div>

      <ReportDetailsModal
        report={viewingReport}
        open={!!viewingReport}
        onOpenChange={(open) => { if (!open) setViewingReport(null) }}
        onToggleReview={
          isManager && viewingReport
            ? () => handleToggleReview(viewingReport.id)
            : undefined
        }
        canReview={isManager}
      />
    </div>
  )
}
