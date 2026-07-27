import api from "@/lib/api/client"
import type { Feedback, CreateFeedbackPayload } from "@/lib/types/feedback"

function mapFeedback(f: Record<string, unknown>): Feedback {
  return {
    id: f.id as number,
    content: f.content as string,
    createdAt: f.createdAt as string,
    fromId: (f.fromId as number) ?? null,
    fromName: (f.fromName as string) ?? null,
    toId: (f.toId as number) ?? null,
    toName: (f.toName as string) ?? null,
  }
}

interface PaginatedResult {
  feedback: Feedback[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const feedbackRepository = {
  async getReceived(page = 1, limit = 20): Promise<PaginatedResult> {
    const response = await api.get("/feedback/received", { params: { page, limit } })
    const { feedback, pagination } = response.data.data as {
      feedback: Record<string, unknown>[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }
    return { feedback: feedback.map(mapFeedback), pagination }
  },

  async getSent(page = 1, limit = 20): Promise<PaginatedResult> {
    const response = await api.get("/feedback/sent", { params: { page, limit } })
    const { feedback, pagination } = response.data.data as {
      feedback: Record<string, unknown>[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }
    return { feedback: feedback.map(mapFeedback), pagination }
  },

  async create(data: CreateFeedbackPayload): Promise<Feedback> {
    const response = await api.post("/feedback", data)
    return mapFeedback(response.data.data as Record<string, unknown>)
  },
}
