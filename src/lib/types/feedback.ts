export interface Feedback {
  id: number
  content: string
  createdAt: string
  fromId: number | null
  fromName: string | null
  toId: number | null
  toName: string | null
}

export interface CreateFeedbackPayload {
  toId: number
  content: string
}
