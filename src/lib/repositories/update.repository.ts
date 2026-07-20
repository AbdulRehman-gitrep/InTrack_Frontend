import { Role } from "@/lib/types/role"
import type { DailyUpdate } from "@/lib/types/update"
import type { CreateDailyUpdateDto } from "@/lib/dto/create-daily-update.dto"
import { mockDailyUpdates } from "@/lib/mock/daily-updates"
import { getUsersByRole } from "@/lib/mock/users"

let updates = mockDailyUpdates.map((u) => ({ ...u }))

export function resetUpdateRepository() {
  updates = mockDailyUpdates.map((u) => ({ ...u }))
}

export const updateRepository = {
  async getDailyUpdates(): Promise<DailyUpdate[]> {
    return updates.map((u) => ({ ...u }))
  },

  async getUpdatesForIntern(internId: string): Promise<DailyUpdate[]> {
    return updates
      .filter((u) => u.internId === internId)
      .map((u) => ({ ...u }))
  },

  async getUpdatesForReviewer(userId: string): Promise<DailyUpdate[]> {
    const internIds = getUsersByRole(Role.INTERN)
      .filter((u) => u.managerId === userId || u.buddyId === userId)
      .map((u) => u.id)
    return updates
      .filter((u) => internIds.includes(u.internId))
      .map((u) => ({ ...u }))
  },

  async submitDailyUpdate(data: CreateDailyUpdateDto): Promise<DailyUpdate> {
    const newUpdate: DailyUpdate = {
      id: String(Date.now()),
      internId: data.internId,
      date: data.date,
      content: data.content,
      isReviewed: false,
      createdAt: new Date().toISOString(),
    }
    updates.push(newUpdate)
    return { ...newUpdate }
  },

  async markUpdateReviewed(id: string): Promise<DailyUpdate | undefined> {
    const index = updates.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    updates[index] = { ...updates[index], isReviewed: !updates[index].isReviewed }
    return { ...updates[index] }
  },
}
