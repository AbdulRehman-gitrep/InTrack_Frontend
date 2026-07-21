"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Attachment } from "@/lib/types/update"
import { FilePreviewCard } from "./FilePreviewCard"

const MAX_FILES = 10
const MAX_SIZE = 50 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf", "video/mp4", "video/quicktime", "video/webm"]

const typeToCategory: Record<string, "image" | "pdf" | "video"> = {
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/webp": "image",
  "application/pdf": "pdf",
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/webm": "video",
}

interface FileUploaderProps {
  files: Attachment[]
  onFilesChange: (files: Attachment[]) => void
}

export function FileUploader({ files, onFilesChange }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")

  function processFiles(selected: FileList) {
    const newFiles: Attachment[] = []
    const errors: string[] = []

    for (const file of Array.from(selected)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a supported file type.`)
        continue
      }
      if (file.size > MAX_SIZE) {
        errors.push(`"${file.name}" exceeds the 50 MB limit.`)
        continue
      }
      const type = typeToCategory[file.type]
      if (!type) {
        errors.push(`"${file.name}" is not a supported file type.`)
        continue
      }
      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type,
        size: file.size,
      })
    }

    return { newFiles, errors }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const { newFiles, errors } = processFiles(e.dataTransfer.files)
    applyFiles(newFiles, errors)
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const { newFiles, errors } = processFiles(e.target.files)
    applyFiles(newFiles, errors)
    e.target.value = ""
  }

  function applyFiles(newFiles: Attachment[], errors: string[]) {
    const total = files.length + newFiles.length
    if (total > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed. You can add ${MAX_FILES - files.length} more.`)
      return
    }
    onFilesChange([...files, ...newFiles])
    if (errors.length > 0) {
      setError(errors.join("\n"))
      setTimeout(() => setError(""), 5000)
    }
  }

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-6 transition-all ${
        dragging
          ? "border-blue-500 bg-blue-50"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4,.mov,.webm"
        className="hidden"
        onChange={handleSelect}
      />
      <div className="flex flex-col items-center gap-2 py-4">
        <Upload className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">
          Drag & Drop Files Here
        </p>
        <p className="text-xs text-muted-foreground">or</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground">
          Supported: Images, PDF, Videos (max 50 MB each)
        </p>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
