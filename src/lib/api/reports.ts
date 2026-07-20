import { apiClient } from "./client"

export const reportsApi = {
  getAll: () => apiClient.get<void[]>(),
  create: () => apiClient.post<void>(),
  markReviewed: (id: string) => apiClient.patch<void>(),
}
