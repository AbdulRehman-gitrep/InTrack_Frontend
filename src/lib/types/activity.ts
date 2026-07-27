export interface ActivityUser {
  id: number
  fullName: string
}

export interface Activity {
  id: number
  user: ActivityUser | null
  actionType: string
  entityType: string
  entityId: number
  description: string | null
  createdAt: string
}
