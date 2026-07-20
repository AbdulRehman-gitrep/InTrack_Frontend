import { apiClient } from "./client"

export const feedbackApi = {
  getAll: () => apiClient.get<void[]>(),
  create: () => apiClient.post<void>(),
}
