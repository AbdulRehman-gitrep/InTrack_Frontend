"use client"

import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { FileUploader } from "./FileUploader"
import type { ReportAttachment } from "@/lib/types/report"

interface ReportFormProps {
  initialTitle?: string
  initialDescription?: string
  existingAttachments?: ReportAttachment[]
  onSubmit: (data: { title: string; description: string; files: File[] }) => void
  onDeleteAttachment?: (publicId: string) => void
  onCancel?: () => void
  submitLabel?: string
  title?: string
}

export function ReportForm({
  initialTitle = "",
  initialDescription = "",
  existingAttachments,
  onSubmit,
  onDeleteAttachment,
  onCancel,
  submitLabel = "Submit Report",
  title = "Submit a Report",
}: ReportFormProps) {
  const [reportTitle, setReportTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reportTitle.trim()) {
      setError("Please enter a report title.")
      return
    }
    if (!description.trim()) {
      setError("Please enter a description.")
      return
    }
    onSubmit({ title: reportTitle.trim(), description: description.trim(), files })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Title</label>
            <input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Enter a title for your report"
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work you completed..."
              rows={4}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {existingAttachments && existingAttachments.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Existing Attachments ({existingAttachments.length})
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {existingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="group relative flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-md"
                  >
                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-md ${
                      att.fileType.startsWith("image/") ? "bg-gradient-to-br from-blue-50 to-purple-50" :
                      att.fileType === "application/pdf" ? "bg-red-50" : "bg-purple-50"
                    }`}>
                      {att.fileType.startsWith("image/") ? (
                        <span className="text-2xl">🖼</span>
                      ) : att.fileType === "application/pdf" ? (
                        <span className="text-lg font-bold text-red-600">PDF</span>
                      ) : (
                        <span className="text-lg">🎬</span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{att.fileName}</span>
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View file
                      </a>
                    </div>
                    {onDeleteAttachment && (
                      <button
                        type="button"
                        onClick={() => onDeleteAttachment(att.publicId)}
                        className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-red-600"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Add New Attachments</label>
            <FileUploader files={files} onFilesChange={setFiles} />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit">
              <Send className="mr-1.5 size-4" />
              {submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
