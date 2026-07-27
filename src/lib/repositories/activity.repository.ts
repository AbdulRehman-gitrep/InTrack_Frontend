import api from "@/lib/api/client"
import type { Activity } from "@/lib/types/activity"

function mapActivity(a: Record<string, unknown>): Activity {
  return {
    id: a.id as number,
    user: a.user as Activity["user"] ?? null,
    actionType: a.actionType as string,
    entityType: a.entityType as string,
    entityId: a.entityId as number,
    description: (a.description as string) ?? null,
    createdAt: a.createdAt as string,
  }
}

interface PaginatedResult {
  activities: Activity[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

interface ActivityParams {
  page?: number
  limit?: number
  search?: string
  actionType?: string
  entityType?: string
  userId?: number
  startDate?: string
  endDate?: string
}

export const activityRepository = {
  async getActivities(params?: ActivityParams): Promise<PaginatedResult> {
    const response = await api.get("/activity", { params })
    const { activities, pagination } = response.data.data as {
      activities: Record<string, unknown>[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }
    return { activities: activities.map(mapActivity), pagination }
  },

  async getActivityById(id: number): Promise<Activity> {
    const response = await api.get(`/activity/${id}`)
    return mapActivity(response.data.data as Record<string, unknown>)
  },
}
