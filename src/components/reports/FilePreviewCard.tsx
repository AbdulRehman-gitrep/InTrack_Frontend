"use client"

import { FileIcon, ImageIcon, VideoIcon, X } from "lucide-react"

import type { Attachment } from "@/lib/types/update"

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface FilePreviewCardProps {
  file: Attachment
  onRemove?: () => void
  showRemove?: boolean
}

export function FilePreviewCard({ file, onRemove, showRemove }: FilePreviewCardProps) {
  const content = (
    <>
      {file.type === "image" && file.url && (
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
          <img src={file.url} alt={file.name} className="size-full object-cover" />
        </div>
      )}
      {file.type === "image" && !file.url && (
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 text-2xl">
            🖼
          </div>
        </div>
      )}
      {file.type === "pdf" && (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-red-50">
          <span className="text-lg font-bold text-red-600">PDF</span>
        </div>
      )}
      {file.type === "video" && (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-purple-50">
          <span className="text-lg">🎬</span>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatSize(file.size)}
          {file.duration && ` · ${file.duration}`}
        </span>
      </div>
    </>
  )

  return (
    <div className="group relative flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-md">
      {file.url ? (
        <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1 min-w-0">
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {content}
        </div>
      )}
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
