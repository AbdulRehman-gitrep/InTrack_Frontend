"use client"

import { useState, useMemo, useEffect } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/skeleton"
import { FeedbackCard } from "@/components/feedback/FeedbackCard"

import { useSession } from "@/lib/context/session"

import type { Feedback } from "@/lib/types/feedback"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { feedbackRepository } from "@/lib/repositories/feedback.repository"
import { userRepository } from "@/lib/repositories/user.repository"

export default function FeedbackPage() {
  const { user } = useSession()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [content, setContent] = useState("")
  const [recipientId, setRecipientId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const isIntern = user.role === Role.INTERN

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [loadedFeedback, loadedUsers] = await Promise.all([
        feedbackRepository.getFeedback(),
        userRepository.getUsers(),
      ])
      setFeedback(loadedFeedback)
      setAllUsers(loadedUsers)
      setLoading(false)
    }
    load()
  }, [])

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers])

  const visibleFeedback = useMemo(
    () =>
      [...feedback]
        .filter((f) => (isIntern ? f.toId === user.id : f.fromId === user.id))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [feedback, user.id, isIntern],
  )

  const interns = useMemo(
    () => allUsers.filter((u) => u.role === Role.INTERN && u.isActive),
    [allUsers],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError("Write your feedback before submitting.")
      return
    }
    if (!recipientId) {
      setError("Select an intern.")
      return
    }
    const created = await feedbackRepository.createFeedback({
      fromId: user.id,
      toId: recipientId,
      content: content.trim(),
    })
    setFeedback((prev) => [created, ...prev])
    setContent("")
    setRecipientId("")
    setError("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Feedback</h1>
        <p className="text-sm text-muted-foreground">
          {isIntern
            ? "Feedback received from your buddy and manager."
            : "Feedback you have given to interns."}
        </p>
      </div>

      {!isIntern && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Give Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipient" className="text-sm font-medium">
                  Intern
                </label>
                <select
                  id="recipient"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select an intern...</option>
                  {interns.map((intern) => (
                    <option key={intern.id} value={intern.id}>
                      {intern.fullName} — {intern.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your feedback..."
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button type="submit">
                <Send className="mr-1.5 size-4" />
                Send Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {isIntern ? "Received" : "Given"} ({visibleFeedback.length})
        </h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </>
        ) : (
          visibleFeedback.map((f) => (
            <FeedbackCard
              key={f.id}
              from={userMap.get(f.fromId)!}
              to={userMap.get(f.toId)!}
              content={f.content}
              createdAt={f.createdAt}
            />
          ))
        )}
        {!loading && visibleFeedback.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isIntern
              ? "No feedback received yet."
              : "No feedback given yet."}
          </p>
        )}
      </div>
    </div>
  )
}
