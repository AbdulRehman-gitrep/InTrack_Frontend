import { apiClient } from "./client"

export const reportsApi = {
  getAll: () => apiClient.get<void[]>(),
  create: () => apiClient.post<void>(),
  update: (id: string) => apiClient.patch<void>(),
  delete: (id: string) => apiClient.delete<void>(),
  markReviewed: (id: string) => apiClient.patch<void>(),
}
