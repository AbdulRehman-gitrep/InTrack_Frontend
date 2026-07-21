import type { Attachment } from "@/lib/types/update"

export interface CreateReportDto {
  internId: string
  title: string
  description: string
  attachments: Attachment[]
}
