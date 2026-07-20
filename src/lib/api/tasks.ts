import { apiClient } from "./client"

export const tasksApi = {
  getAll: () => apiClient.get<void[]>(),
  getById: (id: string) => apiClient.get<void>(),
  create: () => apiClient.post<void>(),
  update: (id: string) => apiClient.patch<void>(),
  delete: (id: string) => apiClient.delete<void>(),
}
