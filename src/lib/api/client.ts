export const apiClient = {
  async get<T>(): Promise<T> {
    throw new Error("Backend not connected")
  },

  async post<T>(): Promise<T> {
    throw new Error("Backend not connected")
  },

  async patch<T>(): Promise<T> {
    throw new Error("Backend not connected")
  },

  async delete<T>(): Promise<T> {
    throw new Error("Backend not connected")
  },
}
