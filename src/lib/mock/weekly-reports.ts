import type { WeeklyReport } from "@/lib/types/update"

export const mockWeeklyReports: WeeklyReport[] = [
  {
    id: "1",
    internId: "6",
    weekStart: "2026-06-29",
    weekEnd: "2026-07-05",
    content: "This week I focused on setting up the CI/CD pipeline. I configured GitHub Actions for linting, type checking, and automated testing. The deployment step is still being worked on. I also started reviewing the OpenAPI specification for the API documentation task. Overall, it was a productive week with a few blockers that were resolved with help from my buddy.",
    isReviewed: true,
    createdAt: "2026-07-05T18:00:00Z",
  },
  {
    id: "2",
    internId: "6",
    weekStart: "2026-07-06",
    weekEnd: "2026-07-12",
    content: "Made significant progress on the CI/CD pipeline. The deployment script is now working and all workflows are passing. Started documenting the REST API endpoints. The weekly goals were mostly met. Next week I plan to complete the API documentation and start on the design system audit.",
    isReviewed: false,
    createdAt: "2026-07-12T17:30:00Z",
  },
  {
    id: "3",
    internId: "7",
    weekStart: "2026-06-29",
    weekEnd: "2026-07-05",
    content: "Completed the database schema migration from SQLite to PostgreSQL. All data integrity checks passed. Began planning the dashboard charts implementation. The migration took longer than expected due to some edge cases with data types, but the result is solid.",
    isReviewed: true,
    createdAt: "2026-07-05T18:15:00Z",
  },
  {
    id: "4",
    internId: "7",
    weekStart: "2026-07-06",
    weekEnd: "2026-07-12",
    content: "Focused on the dashboard charts this week. Implemented bar charts and line charts using Recharts. The components are responsive and accept dynamic data. Still need to add tooltips, legends, and proper theming. On track to complete by the deadline.",
    isReviewed: true,
    createdAt: "2026-07-12T17:45:00Z",
  },
  {
    id: "5",
    internId: "8",
    weekStart: "2026-06-29",
    weekEnd: "2026-07-05",
    content: "Started writing unit tests for the auth module. Covered basic login and logout flows. The testing framework is Jest with React Testing Library. Need to increase coverage for error handling scenarios.",
    isReviewed: false,
    createdAt: "2026-07-05T17:00:00Z",
  },
]
