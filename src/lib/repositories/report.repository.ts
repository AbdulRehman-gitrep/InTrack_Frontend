import { Role } from "@/lib/types/role"
import type { Attachment, Report } from "@/lib/types/update"
import type { CreateReportDto } from "@/lib/dto/create-report.dto"
import { mockReports } from "@/lib/mock/reports"
import { getUsersByRole } from "@/lib/mock/users"

let reports = mockReports.map((r) => ({ ...r, attachments: r.attachments.map((a) => ({ ...a })) }))

export function resetReportRepository() {
  reports = mockReports.map((r) => ({ ...r, attachments: r.attachments.map((a) => ({ ...a })) }))
}

export const reportRepository = {
  async getReports(): Promise<Report[]> {
    return reports.map((r) => ({ ...r, attachments: r.attachments.map((a) => ({ ...a })) }))
  },

  async getReportsForIntern(internId: string): Promise<Report[]> {
    return reports
      .filter((r) => r.internId === internId)
      .map((r) => ({ ...r, attachments: r.attachments.map((a) => ({ ...a })) }))
  },

  async getReportsForReviewer(userId: string): Promise<Report[]> {
    const internIds = getUsersByRole(Role.INTERN)
      .filter((u) => u.managerId === userId || u.buddyId === userId)
      .map((u) => u.id)
    return reports
      .filter((r) => internIds.includes(r.internId))
      .map((r) => ({ ...r, attachments: r.attachments.map((a) => ({ ...a })) }))
  },

  async getReportsForManager(managerId: string): Promise<Report[]> {
    const internIds = getUsersByRole(Role.INTERN)
      .filter((u) => u.managerId === managerId)
      .map((u) => u.id)
    return reports
      .filter((r) => internIds.includes(r.internId))
      .map((r) => ({ ...r, attachments: r.attachments.map((a) => ({ ...a })) }))
  },

  async submitReport(data: CreateReportDto): Promise<Report> {
    const newReport: Report = {
      id: String(Date.now()),
      internId: data.internId,
      title: data.title,
      description: data.description,
      attachments: data.attachments.map((a) => ({ ...a })),
      status: "Pending",
      createdAt: new Date().toISOString(),
    }
    reports.push(newReport)
    return { ...newReport, attachments: newReport.attachments.map((a) => ({ ...a })) }
  },

  async updateReport(id: string, data: { title: string; description: string; attachments: Attachment[] }): Promise<Report | undefined> {
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return undefined
    reports[index] = {
      ...reports[index],
      title: data.title,
      description: data.description,
      attachments: data.attachments.map((a) => ({ ...a })),
    }
    return { ...reports[index], attachments: reports[index].attachments.map((a) => ({ ...a })) }
  },

  async deleteReport(id: string): Promise<boolean> {
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return false
    reports.splice(index, 1)
    return true
  },

  async markReportReviewed(id: string): Promise<Report | undefined> {
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return undefined
    reports[index] = {
      ...reports[index],
      status: "Reviewed",
    }
    return { ...reports[index], attachments: reports[index].attachments.map((a) => ({ ...a })) }
  },
}
