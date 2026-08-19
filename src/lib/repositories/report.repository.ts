import api from "@/lib/api/client"
import type { Report, PaginatedReports } from "@/lib/types/report"

function mapReport(r: Record<string, unknown>): Report {
  return {
    id: r.id as number,
    title: r.title as string,
    description: r.description as string,
    status: r.status as "PENDING" | "REVIEWED",
    internId: (r.internId as number) ?? null,
    internName: (r.internName as string) ?? null,
    attachments: ((r.attachments as Record<string, unknown>[]) ?? []).map((a) => ({
      id: a.id as number,
      fileName: a.fileName as string,
      fileType: a.fileType as string,
      fileUrl: a.fileUrl as string,
      publicId: a.publicId as string,
      createdAt: a.createdAt as string,
    })),
    createdAt: r.createdAt as string,
  }
}

export const reportRepository = {
  async getReports(params?: Record<string, string | number | undefined>): Promise<PaginatedReports> {
    const response = await api.get("/reports", { params })
    const { reports, pagination } = response.data.data as {
      reports: Record<string, unknown>[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }
    return { reports: reports.map(mapReport), pagination }
  },

  async getReportById(id: number): Promise<Report> {
    const response = await api.get(`/reports/${id}`)
    return mapReport(response.data.data as Record<string, unknown>)
  },

  async createReport(data: { title: string; description: string; files: File[] }): Promise<Report> {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    for (const file of data.files) {
      formData.append("files", file)
    }
    const response = await api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return mapReport(response.data.data as Record<string, unknown>)
  },

  async updateReport(id: number, data: { title?: string; description?: string; files?: File[] }): Promise<Report> {
    const formData = new FormData()
    if (data.title !== undefined) formData.append("title", data.title)
    if (data.description !== undefined) formData.append("description", data.description)
    if (data.files) {
      for (const file of data.files) {
        formData.append("files", file)
      }
    }
    const response = await api.patch(`/reports/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return mapReport(response.data.data as Record<string, unknown>)
  },

  async deleteReport(id: number): Promise<void> {
    await api.delete(`/reports/${id}`)
  },

  async markReportReviewed(id: number): Promise<Report> {
    const response = await api.patch(`/reports/${id}/review`)
    return mapReport(response.data.data as Record<string, unknown>)
  },

  async deleteAttachment(reportId: number, publicId: string): Promise<void> {
    await api.delete(`/reports/${reportId}/attachments/${encodeURIComponent(publicId)}`)
  },
}
