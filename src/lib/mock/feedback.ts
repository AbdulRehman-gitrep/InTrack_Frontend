import type { Feedback } from "@/lib/types/feedback"

export const mockFeedback: Feedback[] = [
  {
    id: "1",
    fromId: "4",
    toId: "6",
    content: "Great work on the CI/CD pipeline this week! Your troubleshooting skills are improving. One area to focus on is documenting your process as you go — it will help the team understand your approach better.",
    createdAt: "2026-07-08T10:00:00Z",
  },
  {
    id: "2",
    fromId: "4",
    toId: "6",
    content: "Your API documentation draft looks solid. Make sure to include error response examples for each endpoint. Let's review it together tomorrow.",
    createdAt: "2026-07-10T14:30:00Z",
  },
  {
    id: "3",
    fromId: "2",
    toId: "7",
    content: "Excellent progress on the database migration. The testing approach was thorough. For the dashboard charts, consider adding loading states before fetching data.",
    createdAt: "2026-07-09T11:00:00Z",
  },
  {
    id: "4",
    fromId: "5",
    toId: "8",
    content: "Good start on the auth unit tests. Make sure to cover the token refresh edge case where the refresh token itself is expired.",
    createdAt: "2026-07-08T09:45:00Z",
  },
  {
    id: "5",
    fromId: "5",
    toId: "8",
    content: "The test coverage is looking much better now. Remember to also test the rate limiting scenarios for the login endpoint.",
    createdAt: "2026-07-11T16:00:00Z",
  },
]
