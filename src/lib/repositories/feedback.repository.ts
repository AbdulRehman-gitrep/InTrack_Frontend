import type { Feedback } from "@/lib/types/feedback"
import type { CreateFeedbackDto } from "@/lib/dto/create-feedback.dto"
import { mockFeedback } from "@/lib/mock/feedback"

let feedback = mockFeedback.map((f) => ({ ...f }))

export function resetFeedbackRepository() {
  feedback = mockFeedback.map((f) => ({ ...f }))
}

export const feedbackRepository = {
  async getFeedback(): Promise<Feedback[]> {
    return feedback.map((f) => ({ ...f }))
  },

  async getFeedbackReceived(userId: string): Promise<Feedback[]> {
    return feedback
      .filter((f) => f.toId === userId)
      .map((f) => ({ ...f }))
  },

  async getFeedbackGiven(userId: string): Promise<Feedback[]> {
    return feedback
      .filter((f) => f.fromId === userId)
      .map((f) => ({ ...f }))
  },

  async createFeedback(data: CreateFeedbackDto): Promise<Feedback> {
    const newFeedback: Feedback = {
      id: String(Date.now()),
      fromId: data.fromId,
      toId: data.toId,
      content: data.content,
      createdAt: new Date().toISOString(),
    }
    feedback.push(newFeedback)
    return { ...newFeedback }
  },
}
