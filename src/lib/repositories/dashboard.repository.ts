import api from "@/lib/api/client"
import type { Task, TaskStatus } from "@/lib/types/task"

interface InternBrief {
  id: number
  fullName: string
  department: string
}

interface AdminStats {
  totalUsers: number
  activeInterns: number
  departmentStats: { title: string; count: number }[]
}

interface ManagerStats {
  assignedInterns: number
  activeTasks: number
  pendingReports: number
}

interface ManagerInternProgress {
  intern: InternBrief
  tasksCompleted: number
  totalTasks: number
  reportsReviewed: number
  totalReports: number
}

interface ManagerDashboard {
  assignedInterns: number
  activeTasks: number
  pendingReports: number
  internProgress: ManagerInternProgress[]
}

interface BuddyStats {
  assignedInterns: number
  pendingReports: number
  totalFeedbackGiven: number
}

interface BuddyInternProgress {
  intern: InternBrief
  reportsReviewed: number
  totalReports: number
  feedbackCount: number
}

interface BuddyDashboard {
  assignedInterns: number
  pendingReports: number
  totalFeedbackGiven: number
  internProgress: BuddyInternProgress[]
}

interface InternDashboard {
  activeTasks: number
  reportsSubmitted: number
  feedbackReceived: number
  tasks: { status: TaskStatus }[]
}

export const dashboardRepository = {
  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get("/dashboard/admin")
    return response.data.data as AdminStats
  },

  async getManagerDashboard(): Promise<ManagerDashboard> {
    const response = await api.get("/dashboard/manager")
    return response.data.data as ManagerDashboard
  },

  async getBuddyDashboard(): Promise<BuddyDashboard> {
    const response = await api.get("/dashboard/buddy")
    return response.data.data as BuddyDashboard
  },

  async getInternDashboard(): Promise<InternDashboard> {
    const response = await api.get("/dashboard/intern")
    return response.data.data as InternDashboard
  },
}
