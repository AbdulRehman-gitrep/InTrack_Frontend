"use client"

import { Calendar, CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import type { User as UserType } from "@/lib/types/user"

interface ReportCardProps {
  author: UserType
  dateLabel: string
  content: string
  status: "Pending" | "Reviewed"
  onToggleReview?: () => void
  onEdit?: () => void
  onDelete?: () => void
  canEdit?: boolean
}

export function ReportCard({
  author,
  dateLabel,
  content,
  status,
  onToggleReview,
  onEdit,
  onDelete,
  canEdit,
}: ReportCardProps) {
  const isReviewed = status === "Reviewed"
  return (
    <Card className={isReviewed ? "opacity-70" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
              {author.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{author.fullName}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {dateLabel}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {content}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {onToggleReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleReview}
                className={isReviewed ? "text-emerald-600" : "text-muted-foreground"}
              >
                {isReviewed ? (
                  <CheckCircle2 className="mr-1.5 size-4" />
                ) : (
                  <Circle className="mr-1.5 size-4" />
                )}
                {isReviewed ? "Reviewed" : "Mark as Reviewed"}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            {canEdit && (
              <>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Pencil className="mr-1.5 size-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash2 className="mr-1.5 size-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
