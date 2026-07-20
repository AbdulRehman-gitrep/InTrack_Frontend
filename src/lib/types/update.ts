export interface DailyUpdate {
  id: string
  internId: string
  date: string
  content: string
  isReviewed: boolean
  createdAt: string
}

export interface WeeklyReport {
  id: string
  internId: string
  weekStart: string
  weekEnd: string
  content: string
  isReviewed: boolean
  createdAt: string
}
