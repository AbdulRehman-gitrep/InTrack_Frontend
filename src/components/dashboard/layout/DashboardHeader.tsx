"use client"

import { useMemo } from "react"
import { Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  userName: string
  tagline: string
  label?: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function DashboardHeader({ userName, tagline, label = "System Overview" }: DashboardHeaderProps) {
  const greeting = useMemo(() => getGreeting(), [])
  const today = useMemo(() => getFormattedDate(), [])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          {label}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-950">
          {greeting}, {userName}.
        </h1>
        <p className="text-sm text-slate-500">
          {tagline}
        </p>
      </div>
      <Button variant="outline" className="flex items-center gap-2 self-start md:self-auto">
        <Calendar className="size-4" />
        {today}
      </Button>
    </div>
  )
}
