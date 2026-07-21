"use client"

import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { Attachment } from "@/lib/types/update"
import { FileUploader } from "./FileUploader"
import { AttachmentGrid } from "./AttachmentGrid"

interface ReportFormProps {
  initialTitle?: string
  initialDescription?: string
  initialAttachments?: Attachment[]
  onSubmit: (data: { title: string; description: string; attachments: Attachment[] }) => void
  onCancel?: () => void
  submitLabel?: string
  title?: string
}

export function ReportForm({
  initialTitle = "",
  initialDescription = "",
  initialAttachments = [],
  onSubmit,
  onCancel,
  submitLabel = "Submit Report",
  title = "Submit a Report",
}: ReportFormProps) {
  const [reportTitle, setReportTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments)
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
    onSubmit({ title: reportTitle.trim(), description: description.trim(), attachments })
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

          <div className="space-y-3">
            <label className="text-sm font-medium">Attachments</label>
            <FileUploader files={attachments} onFilesChange={setAttachments} />
            {attachments.length > 0 && (
              <AttachmentGrid
                attachments={attachments}
                showRemove
                onRemove={(id) => setAttachments(attachments.filter((a) => a.id !== id))}
              />
            )}
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
