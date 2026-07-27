"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

const MAX_FILES = 5
const MAX_SIZE_IMAGE = 5 * 1024 * 1024
const MAX_SIZE_PDF = 10 * 1024 * 1024
const MAX_SIZE_VIDEO = 50 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4"]

function getSizeLimit(mime: string): number {
  if (mime.startsWith("image/")) return MAX_SIZE_IMAGE
  if (mime === "application/pdf") return MAX_SIZE_PDF
  if (mime.startsWith("video/")) return MAX_SIZE_VIDEO
  return MAX_SIZE_IMAGE
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface FilePreview {
  file: File
  previewUrl?: string
}

interface FileUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function FileUploader({ files, onFilesChange }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")

  const previews: FilePreview[] = files.map((f) => ({
    file: f,
    previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
  }))

  function processFiles(selected: FileList) {
    const valid: File[] = []
    const errors: string[] = []

    for (const file of Array.from(selected)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a supported file type.`)
        continue
      }
      const limit = getSizeLimit(file.type)
      if (file.size > limit) {
        errors.push(`"${file.name}" exceeds the size limit.`)
        continue
      }
      valid.push(file)
    }

    return { valid, errors }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const { valid, errors } = processFiles(e.dataTransfer.files)
    applyFiles(valid, errors)
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const { valid, errors } = processFiles(e.target.files)
    applyFiles(valid, errors)
    e.target.value = ""
  }

  function applyFiles(newFiles: File[], errors: string[]) {
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

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const typeIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼"
    if (file.type === "application/pdf") return "PDF"
    if (file.type.startsWith("video/")) return "🎬"
    return "📄"
  }

  const bgClass = (file: File) => {
    if (file.type.startsWith("image/")) return "from-blue-50 to-purple-50"
    if (file.type === "application/pdf") return "bg-red-50"
    if (file.type.startsWith("video/")) return "bg-purple-50"
    return "bg-gray-50"
  }

  return (
    <div>
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
          accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4"
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
            Supported: Images (5MB), PDF (10MB), Video (50MB)
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {previews.map((p, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-md"
            >
              <div className={`flex size-14 shrink-0 items-center justify-center rounded-md ${bgClass(p.file)}`}>
                {p.file.type.startsWith("image/") ? (
                  <span className="text-2xl">{typeIcon(p.file)}</span>
                ) : p.file.type === "application/pdf" ? (
                  <span className="text-lg font-bold text-red-600">{typeIcon(p.file)}</span>
                ) : (
                  <span className="text-lg">{typeIcon(p.file)}</span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{p.file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatSize(p.file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600 whitespace-pre-line">{error}</p>
      )}
    </div>
  )
}
