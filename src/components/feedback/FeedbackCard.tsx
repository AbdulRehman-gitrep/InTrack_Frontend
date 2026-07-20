"use client"

import { Calendar, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import type { User as UserType } from "@/lib/types/user"

interface FeedbackCardProps {
  from: UserType
  to: UserType
  content: string
  createdAt: string
}

export function FeedbackCard({ from, to, content, createdAt }: FeedbackCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
            {from.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{from.fullName}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          <User className="size-3" />
          to {to.fullName}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
