"use client"

import { Calendar, CheckCircle2, Clock, Eye, FileText, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { Report } from "@/lib/types/report"

function StatusBadge({ status }: { status: "PENDING" | "REVIEWED" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "REVIEWED"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status === "REVIEWED" ? (
        <CheckCircle2 className="size-3" />
      ) : (
        <Clock className="size-3" />
      )}
      {status === "REVIEWED" ? "Reviewed" : "Pending"}
    </span>
  )
}

interface ReportCardProps {
  report: Report
  authorName: string
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ReportCard({ report, authorName, onView, onEdit, onDelete }: ReportCardProps) {
  const truncated = report.description.length > 120
    ? report.description.slice(0, 120) + "..."
    : report.description

  return (
    <Card className="group transition-all hover:shadow-lg hover:border-muted-foreground/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{report.title}</h3>
              <StatusBadge status={report.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {authorName} · {new Date(report.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {report.description}
            </p>
            <div className="flex items-center gap-4 pt-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                {report.attachments.length} {report.attachments.length === 1 ? "File" : "Files"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {(onEdit || onDelete) && (
              <div className="hidden group-hover:flex items-center gap-1">
                {onEdit && (
                  <Button variant="ghost" size="icon" className="size-8" onClick={onEdit}>
                    <Pencil className="size-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="icon" className="size-8 text-red-500 hover:text-red-600" onClick={onDelete}>
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onView}>
              View Details
              <Eye className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
