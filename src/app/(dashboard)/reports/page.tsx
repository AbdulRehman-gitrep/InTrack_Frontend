"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReportCardSkeleton } from "@/components/ui/skeleton"
import { ReportCard } from "@/components/reports/ReportCard"
import { ReportDetailsModal } from "@/components/reports/ReportDetailsModal"
import { ReportForm } from "@/components/reports/ReportForm"
import { EmptyReportsState } from "@/components/reports/EmptyReportsState"

import { useSession } from "@/lib/context/session"

import type { Report } from "@/lib/types/report"
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
      const [loadedReports, { users: loadedUsers }] = await Promise.all([
        reportRepository.getReports(),
        userRepository.getUsers(),
      ])
      setReports(loadedReports.reports)
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
      filtered = filtered.filter((r) => r.internId === Number(user.id))
    }

    if ((isManager || user.role === Role.BUDDY) && filterIntern !== "all") {
      filtered = filtered.filter((r) => r.internId === Number(filterIntern))
    }

    if (searchDate) {
      filtered = filtered.filter(
        (r) => r.createdAt.split("T")[0] === searchDate,
      )
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [reports, user.id, isIntern, isManager, filterIntern, searchDate])

  const handleCreateReport = useCallback(async (data: { title: string; description: string; files: File[] }) => {
    const created = await reportRepository.createReport({
      title: data.title,
      description: data.description,
      files: data.files,
    })
    setReports((prev) => [created, ...prev])
    setShowForm(false)
  }, [])

  const handleUpdateReport = useCallback(async (data: { title: string; description: string; files: File[] }) => {
    if (!editingReport) return
    const updated = await reportRepository.updateReport(editingReport.id, {
      title: data.title,
      description: data.description,
      files: data.files.length > 0 ? data.files : undefined,
    })
    setReports((prev) =>
      prev.map((r) => (r.id === editingReport.id ? updated : r)),
    )
    setEditingReport(null)
  }, [editingReport])

  const handleDeleteAttachment = useCallback(async (publicId: string) => {
    if (!editingReport) return
    await reportRepository.deleteAttachment(editingReport.id, publicId)
    setEditingReport((prev) => {
      if (!prev) return null
      return {
        ...prev,
        attachments: prev.attachments.filter((a) => a.publicId !== publicId),
      }
    })
  }, [editingReport])

  const handleDelete = useCallback(async (reportId: number) => {
    await reportRepository.deleteReport(reportId)
    setReports((prev) => prev.filter((r) => r.id !== reportId))
  }, [])

  const handleToggleReview = useCallback(async (reportId: number) => {
    const updated = await reportRepository.markReportReviewed(reportId)
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? updated : r)),
    )
  }, [])

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
        {isIntern && !showForm && !editingReport && visibleReports.length > 0 && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-1.5 size-4" />
            New Report
          </Button>
        )}
      </div>

      {isIntern && showForm && (
        <ReportForm
          onSubmit={handleCreateReport}
          onCancel={() => setShowForm(false)}
        />
      )}

      {isIntern && editingReport && (
        <ReportForm
          initialTitle={editingReport.title}
          initialDescription={editingReport.description}
          existingAttachments={editingReport.attachments}
          onSubmit={handleUpdateReport}
          onDeleteAttachment={handleDeleteAttachment}
          onCancel={() => setEditingReport(null)}
          submitLabel="Save Changes"
          title="Edit Report"
        />
      )}

      {(isManager || user.role === Role.BUDDY) && (
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
                .filter((u) => u.managerId === user.id || u.buddyId === user.id)
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
              authorName={userMap.get(String(report.internId!))?.fullName ?? "Unknown"}
              onView={() => setViewingReport(report)}
              onEdit={isIntern && report.status === "PENDING" ? () => {
                setEditingReport(report)
                setShowForm(false)
              } : undefined}
              onDelete={isIntern && report.status === "PENDING" ? () => handleDelete(report.id) : undefined}
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
        report={viewingReport ? {
          id: String(viewingReport.id),
          internId: String(viewingReport.internId ?? ""),
          title: viewingReport.title,
          description: viewingReport.description,
          status: viewingReport.status === "REVIEWED" ? "Reviewed" as const : "Pending" as const,
          createdAt: viewingReport.createdAt,
          attachments: viewingReport.attachments.map((a) => ({
            id: String(a.id),
            name: a.fileName,
            type: (a.fileType.startsWith("image/") ? "image" : a.fileType === "application/pdf" ? "pdf" : "video") as "image" | "pdf" | "video",
            size: 0,
            url: a.fileUrl,
          })),
        } : null}
        open={!!viewingReport}
        onOpenChange={(open) => { if (!open) setViewingReport(null) }}
        onToggleReview={
          isManager && viewingReport
            ? () => {
                handleToggleReview(viewingReport.id)
                setViewingReport(null)
              }
            : undefined
        }
        canReview={isManager}
      />
    </div>
  )
}
