"use client"

import { FileText, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmptyReportsStateProps {
  isIntern: boolean
  onCreateReport?: () => void
}

export function EmptyReportsState({ isIntern, onCreateReport }: EmptyReportsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-muted">
        <FileText className="size-10 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">No reports yet</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        {isIntern
          ? "You haven't submitted any reports yet."
          : "No reports from your interns yet."}
      </p>
      {isIntern && (
        <Button onClick={onCreateReport}>
          <Plus className="mr-1.5 size-4" />
          Submit First Report
        </Button>
      )}
    </div>
  )
}
