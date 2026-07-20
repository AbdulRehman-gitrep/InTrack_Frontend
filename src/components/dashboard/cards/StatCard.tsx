import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string
  iconBackground?: string
  valueClassName?: string
  titleClassName?: string
  accentBorderClassName?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBackground = "bg-primary/10",
  valueClassName,
  titleClassName,
  accentBorderClassName,
}: StatCardProps) {
  return (
    <Card className={cn("shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5", accentBorderClassName)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className={cn("text-sm font-medium", titleClassName ?? "text-muted-foreground")}>
            {title}
          </CardTitle>
          <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-full", iconBackground)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}
