export interface Attachment {
  id: string
  name: string
  type: "image" | "pdf" | "video"
  size: number
  url?: string
  thumbnailUrl?: string
  duration?: string
}

export interface Report {
  id: string
  internId: string
  title: string
  description: string
  attachments: Attachment[]
  status: "Pending" | "Reviewed"
  createdAt: string
}
