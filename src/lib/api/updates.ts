import { apiClient } from "./client"

export const updatesApi = {
  getAll: () => apiClient.get<void[]>(),
  create: () => apiClient.post<void>(),
  markReviewed: (id: string) => apiClient.patch<void>(),
}
