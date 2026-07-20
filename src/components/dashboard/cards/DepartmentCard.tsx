import type { LucideIcon } from "lucide-react"

import { Card, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DepartmentCardProps {
  title: string
  count: number
  icon: LucideIcon
  iconColor?: string
  iconBackground?: string
  titleClassName?: string
  accentBorderClassName?: string
}

export function DepartmentCard({
  title,
  count,
  icon: Icon,
  iconColor = "text-slate-500",
  iconBackground = "bg-slate-100",
  titleClassName,
  accentBorderClassName,
}: DepartmentCardProps) {
  return (
    <Card className={cn("shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5", accentBorderClassName)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <p className={cn("text-sm font-medium", titleClassName ?? "text-muted-foreground")}>{title}</p>
          <div className="text-2xl font-bold text-slate-900">{count}</div>
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-full", iconBackground)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
      </CardHeader>
    </Card>
  )
}
