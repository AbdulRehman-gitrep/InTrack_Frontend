"use client"

import { useState, useEffect, useCallback } from "react"
import { Send, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/skeleton"
import { FeedbackCard } from "@/components/feedback/FeedbackCard"

import { useSession } from "@/lib/context/session"

import type { Feedback } from "@/lib/types/feedback"
import { Role } from "@/lib/types/role"
import { feedbackRepository } from "@/lib/repositories/feedback.repository"
import { userRepository } from "@/lib/repositories/user.repository"

export default function FeedbackPage() {
  const { user } = useSession()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [content, setContent] = useState("")
  const [recipientId, setRecipientId] = useState("")
  const [interns, setInterns] = useState<{ id: string; fullName: string; department: string }[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 20

  const isIntern = user.role === Role.INTERN
  const canGive = user.role === Role.MANAGER || user.role === Role.BUDDY

  const loadFeedback = useCallback(async () => {
    const result = isIntern
      ? await feedbackRepository.getReceived(page, limit)
      : await feedbackRepository.getSent(page, limit)
    setFeedback(result.feedback)
    setTotalPages(result.pagination.totalPages)
    setTotal(result.pagination.total)
  }, [isIntern, page])

  useEffect(() => {
    async function load() {
      if (canGive) {
        const params: Record<string, string | number> = { role: Role.INTERN.toUpperCase() }
        if (user.role === Role.MANAGER) {
          params.managerId = Number(user.id)
        }
        if (user.role === Role.BUDDY) {
          params.buddyId = Number(user.id)
        }
        const result = await userRepository.getUsers(params)
        setInterns(result.users.map((u) => ({ id: u.id, fullName: u.fullName, department: u.department })))
      }
      await loadFeedback()
      setLoading(false)
    }
    load()
  }, [canGive, loadFeedback, user.id, user.role])

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
    const created = await feedbackRepository.create({
      toId: Number(recipientId),
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

      {canGive && (
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

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {isIntern ? "Received" : "Given"} ({total})
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </>
        ) : (
          feedback.map((f) => (
            <FeedbackCard
              key={f.id}
              fromName={f.fromName ?? "Unknown"}
              toName={f.toName ?? "Unknown"}
              content={f.content}
              createdAt={f.createdAt}
            />
          ))
        )}
        {!loading && feedback.length === 0 && (
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
