"use client"

import type { Attachment } from "@/lib/types/update"
import { FilePreviewCard } from "./FilePreviewCard"

interface AttachmentGridProps {
  attachments: Attachment[]
  showRemove?: boolean
  onRemove?: (id: string) => void
}

export function AttachmentGrid({ attachments, showRemove, onRemove }: AttachmentGridProps) {
  if (attachments.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {attachments.map((file) => (
        <FilePreviewCard
          key={file.id}
          file={file}
          showRemove={showRemove}
          onRemove={onRemove ? () => onRemove(file.id) : undefined}
        />
      ))}
    </div>
  )
}
