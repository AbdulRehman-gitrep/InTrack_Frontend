"use client"

import { Calendar, CheckCircle2, Circle, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import type { User as UserType } from "@/lib/types/user"

interface UpdateCardProps {
  author: UserType
  dateLabel: string
  title?: string
  content: string
  isReviewed: boolean
  onToggleReview?: () => void
}

export function UpdateCard({
  author,
  dateLabel,
  title,
  content,
  isReviewed,
  onToggleReview,
}: UpdateCardProps) {
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
        {title && (
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {title}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {content}
        </p>
      </CardContent>
      {onToggleReview && (
        <CardFooter className="border-t pt-3">
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
        </CardFooter>
      )}
    </Card>
  )
}
