import type { DailyUpdate } from "@/lib/types/update"

export const mockDailyUpdates: DailyUpdate[] = [
  {
    id: "1",
    internId: "6",
    date: "2026-07-08",
    content: "Worked on the CI/CD pipeline setup. Successfully configured the first GitHub Actions workflow for linting and type checking. Ran into an issue with the deployment step but identified the root cause.",
    isReviewed: true,
    createdAt: "2026-07-08T16:30:00Z",
  },
  {
    id: "2",
    internId: "6",
    date: "2026-07-09",
    content: "Continued with the CI/CD pipeline. Fixed the deployment script and got the workflow passing. Started reading about OpenAPI spec for the API documentation task.",
    isReviewed: false,
    createdAt: "2026-07-09T17:00:00Z",
  },
  {
    id: "3",
    internId: "7",
    date: "2026-07-08",
    content: "Completed the database migration script. Tested it on a staging environment and verified data integrity. Started working on the dashboard charts component.",
    isReviewed: true,
    createdAt: "2026-07-08T16:45:00Z",
  },
  {
    id: "4",
    internId: "7",
    date: "2026-07-09",
    content: "Made good progress on the dashboard charts. Got the bar chart and line chart components rendering with mock data. Need to add tooltips and legends next.",
    isReviewed: false,
    createdAt: "2026-07-09T17:15:00Z",
  },
  {
    id: "5",
    internId: "8",
    date: "2026-07-07",
    content: "Started writing unit tests for the auth module. Covered login, logout, and token refresh flows. 40% done with the target coverage.",
    isReviewed: false,
    createdAt: "2026-07-07T16:00:00Z",
  },
  {
    id: "6",
    internId: "8",
    date: "2026-07-09",
    content: "Continued with auth unit tests. Now at 75% coverage. The remaining tests are for edge cases like expired tokens and concurrent sessions.",
    isReviewed: false,
    createdAt: "2026-07-09T16:30:00Z",
  },
]
