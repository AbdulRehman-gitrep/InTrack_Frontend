"use client"

import { Calendar, CheckCircle2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Report } from "@/lib/types/update"
import { AttachmentGrid } from "./AttachmentGrid"

function StatusBadge({ status }: { status: "Pending" | "Reviewed" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "Reviewed"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status === "Reviewed" ? (
        <CheckCircle2 className="size-3" />
      ) : (
        <Clock className="size-3" />
      )}
      {status}
    </span>
  )
}

interface ReportDetailsModalProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleReview?: () => void
  canReview?: boolean
}

export function ReportDetailsModal({
  report,
  open,
  onOpenChange,
  onToggleReview,
  canReview,
}: ReportDetailsModalProps) {
  if (!report) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {report.title}
            <StatusBadge status={report.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Submitted {new Date(report.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {report.description}
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Attachments ({report.attachments.length})
            </h4>
            <AttachmentGrid attachments={report.attachments} />
          </div>


        </div>

        {canReview && report.status === "Pending" && onToggleReview && (
          <DialogFooter>
            <Button
              onClick={() => {
                onToggleReview()
                onOpenChange(false)
              }}
              className="w-full sm:w-auto"
            >
              <CheckCircle2 className="mr-1.5 size-4" />
              Mark as Reviewed
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
