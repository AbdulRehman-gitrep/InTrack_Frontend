"use client"

import { useState, useMemo, useEffect } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateCardSkeleton } from "@/components/ui/skeleton"
import { UpdateCard } from "@/components/updates/UpdateCard"

import { useSession } from "@/lib/context/session"

import type { DailyUpdate } from "@/lib/types/update"
import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { updateRepository } from "@/lib/repositories/update.repository"
import { userRepository } from "@/lib/repositories/user.repository"

export default function DailyUpdatesPage() {
  const { user } = useSession()
  const [updates, setUpdates] = useState<DailyUpdate[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const isIntern = user.role === Role.INTERN

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [loadedUpdates, loadedUsers] = await Promise.all([
        updateRepository.getDailyUpdates(),
        userRepository.getUsers(),
      ])
      setUpdates(loadedUpdates)
      setAllUsers(loadedUsers)
      setLoading(false)
    }
    load()
  }, [])

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers])

  const visibleUpdates = useMemo(() => {
    if (isIntern) {
      return [...updates]
        .filter((u) => u.internId === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
    const internIds = allUsers
      .filter(
        (u) =>
          u.role === Role.INTERN &&
          (u.managerId === user.id || u.buddyId === user.id),
      )
      .map((u) => u.id)
    return [...updates]
      .filter((u) => internIds.includes(u.internId))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [updates, allUsers, user.id, isIntern])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError("Write your update before submitting.")
      return
    }
    const created = await updateRepository.submitDailyUpdate({
      internId: user.id,
      date: new Date().toISOString().split("T")[0],
      content: content.trim(),
    })
    setUpdates((prev) => [created, ...prev])
    setContent("")
    setError("")
  }

  async function handleToggleReview(updateId: string) {
    const updated = await updateRepository.markUpdateReviewed(updateId)
    if (updated) {
      setUpdates((prev) =>
        prev.map((u) => (u.id === updateId ? updated : u)),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Daily Updates</h1>
        <p className="text-sm text-muted-foreground">
          {isIntern
            ? "Submit your daily updates and view your history."
            : "Review daily updates from your interns."}
        </p>
      </div>

      {isIntern && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit Today&apos;s Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What did you work on today? Any blockers or achievements?"
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
              <Button type="submit">
                <Send className="mr-1.5 size-4" />
                Submit Update
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {isIntern ? "Update History" : "Intern Updates"} ({visibleUpdates.length})
        </h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <UpdateCardSkeleton key={i} />
            ))}
          </>
        ) : (
          visibleUpdates.map((update) => (
            <UpdateCard
              key={update.id}
              author={userMap.get(update.internId)!}
              dateLabel={new Date(update.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              content={update.content}
              isReviewed={update.isReviewed}
              onToggleReview={
                isIntern ? undefined : () => handleToggleReview(update.id)
              }
            />
          ))
        )}
        {!loading && visibleUpdates.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isIntern
              ? "No updates submitted yet."
              : "No updates from your interns."}
          </p>
        )}
      </div>
    </div>
  )
}
