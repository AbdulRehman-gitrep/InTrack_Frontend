import { Role } from "@/lib/types/role"
import { getUsersByRole, mockUsers } from "@/lib/mock/users"
import { mockTasks } from "@/lib/mock/tasks"
import { mockReports } from "@/lib/mock/reports"
import { mockFeedback } from "@/lib/mock/feedback"

export const dashboardRepository = {
  async getAdminStats() {
    const allUsers = mockUsers
    const activeInterns = getUsersByRole(Role.INTERN).filter((u) => u.isActive)

    const deptMap = new Map<string, number>()
    activeInterns.forEach((intern) => {
      deptMap.set(intern.department, (deptMap.get(intern.department) || 0) + 1)
    })

    const departmentStats = Array.from(deptMap.entries()).map(([title, count]) => ({
      title,
      count,
    }))

    return {
      totalUsers: allUsers.length,
      activeInterns: activeInterns.length,
      departmentStats,
    }
  },

  async getManagerStats(managerId: string) {
    const interns = getUsersByRole(Role.INTERN).filter((u) => u.managerId === managerId)
    const activeTasks = mockTasks.filter(
      (t) => t.status === "in_progress" || t.status === "assigned",
    )
    const pendingReports = mockReports.filter((r) => r.status === "Pending")

    return {
      assignedInterns: interns.length,
      activeTasks: activeTasks.length,
      pendingReports: pendingReports.length,
    }
  },

  async getManagerInternProgress(managerId: string) {
    const myInterns = getUsersByRole(Role.INTERN).filter(
      (u) => u.managerId === managerId,
    )

    return myInterns.map((intern) => {
      const internTasks = mockTasks.filter((t) => t.assigneeId === intern.id)
      const tasksCompleted = internTasks.filter((t) => t.status === "completed").length
      const internReports = mockReports.filter((r) => r.internId === intern.id)
      const reportsReviewed = internReports.filter((r) => r.status === "Reviewed").length

      return {
        intern,
        tasksCompleted,
        totalTasks: internTasks.length,
        reportsReviewed,
        totalReports: internReports.length,
      }
    })
  },

  async getBuddyStats(buddyId: string) {
    const myInterns = getUsersByRole(Role.INTERN).filter(
      (u) => u.buddyId === buddyId,
    )
    const pendingReports = mockReports.filter(
      (r) => r.status === "Pending" && myInterns.some((i) => i.id === r.internId),
    )

    return {
      assignedInterns: myInterns.length,
      pendingReports: pendingReports.length,
    }
  },

  async getBuddyInternProgress(buddyId: string) {
    const myInterns = getUsersByRole(Role.INTERN).filter(
      (u) => u.buddyId === buddyId,
    )

    return myInterns.map((intern) => {
      const internReports = mockReports.filter((r) => r.internId === intern.id)
      const reportsReviewed = internReports.filter((r) => r.status === "Reviewed").length

      return {
        intern,
        reportsReviewed,
        totalReports: internReports.length,
        feedbackCount: internReports.length,
      }
    })
  },

  async getInternStats(internId: string) {
    const myTasks = mockTasks.filter((t) => t.assigneeId === internId)
    const activeTasks = myTasks.filter(
      (t) => t.status === "in_progress" || t.status === "assigned",
    )
    const myReports = mockReports.filter((r) => r.internId === internId)
    const myFeedback = mockFeedback.filter((f) => f.toId === internId)

    return {
      myTasks,
      activeTasks: activeTasks.length,
      reportsSubmitted: myReports.length,
      feedbackReceived: myFeedback.length,
    }
  },
}