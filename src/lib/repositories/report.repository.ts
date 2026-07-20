import { Role } from "@/lib/types/role"
import type { WeeklyReport } from "@/lib/types/update"
import type { CreateWeeklyReportDto } from "@/lib/dto/create-weekly-report.dto"
import { mockWeeklyReports } from "@/lib/mock/weekly-reports"
import { getUsersByRole } from "@/lib/mock/users"

let reports = mockWeeklyReports.map((r) => ({ ...r }))

export function resetReportRepository() {
  reports = mockWeeklyReports.map((r) => ({ ...r }))
}

export const reportRepository = {
  async getWeeklyReports(): Promise<WeeklyReport[]> {
    return reports.map((r) => ({ ...r }))
  },

  async getReportsForIntern(internId: string): Promise<WeeklyReport[]> {
    return reports
      .filter((r) => r.internId === internId)
      .map((r) => ({ ...r }))
  },

  async getReportsForManager(managerId: string): Promise<WeeklyReport[]> {
    const internIds = getUsersByRole(Role.INTERN)
      .filter((u) => u.managerId === managerId)
      .map((u) => u.id)
    return reports
      .filter((r) => internIds.includes(r.internId))
      .map((r) => ({ ...r }))
  },

  async submitWeeklyReport(data: CreateWeeklyReportDto): Promise<WeeklyReport> {
    const newReport: WeeklyReport = {
      id: String(Date.now()),
      internId: data.internId,
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
      content: data.content,
      isReviewed: false,
      createdAt: new Date().toISOString(),
    }
    reports.push(newReport)
    return { ...newReport }
  },

  async markReportReviewed(id: string): Promise<WeeklyReport | undefined> {
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return undefined
    reports[index] = { ...reports[index], isReviewed: !reports[index].isReviewed }
    return { ...reports[index] }
  },
}
