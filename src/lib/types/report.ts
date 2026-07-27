export interface ReportAttachment {
  id: number
  fileName: string
  fileType: string
  fileUrl: string
  publicId: string
  createdAt: string
}

export type ReportStatus = "PENDING" | "REVIEWED"

export interface Report {
  id: number
  title: string
  description: string
  status: ReportStatus
  internId: number | null
  internName: string | null
  attachments: ReportAttachment[]
  createdAt: string
}

export interface PaginatedReports {
  reports: Report[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
