import { apiClient } from "./client"

export const authApi = {
  login: () => apiClient.post<{ token: string }>(),
  logout: () => apiClient.post<void>(),
  getCurrentUser: () => apiClient.get<{ id: string }>(),
}
