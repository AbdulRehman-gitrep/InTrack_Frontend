"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, ChevronLeft, ChevronRight, Clock } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Activity } from "@/lib/types/activity"
import { activityRepository } from "@/lib/repositories/activity.repository"

const actionTypeOptions = [
  { value: "", label: "All Actions" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "CREATE_USER", label: "Create User" },
  { value: "UPDATE_USER", label: "Update User" },
  { value: "CHANGE_USER_STATUS", label: "Change Status" },
  { value: "CREATE_TASK", label: "Create Task" },
  { value: "UPDATE_TASK_STATUS", label: "Update Task Status" },
  { value: "CREATE_FEEDBACK", label: "Create Feedback" },
]

const entityTypeOptions = [
  { value: "", label: "All Entities" },
  { value: "USER", label: "User" },
  { value: "TASK", label: "Task" },
  { value: "FEEDBACK", label: "Feedback" },
  { value: "AUTH", label: "Auth" },
]

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {["User", "Action", "Entity", "Description", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b last:border-b-0">
              {Array.from({ length: 5 }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatActionLabel(actionType: string): string {
  return actionType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function ActionBadge({ actionType }: { actionType: string }) {
  const colors: Record<string, string> = {
    LOGIN: "bg-green-100 text-green-700",
    LOGOUT: "bg-gray-100 text-gray-700",
    CREATE_USER: "bg-blue-100 text-blue-700",
    UPDATE_USER: "bg-yellow-100 text-yellow-700",
    CHANGE_USER_STATUS: "bg-purple-100 text-purple-700",
    CREATE_TASK: "bg-blue-100 text-blue-700",
    UPDATE_TASK: "bg-yellow-100 text-yellow-700",
    UPDATE_TASK_STATUS: "bg-indigo-100 text-indigo-700",
    DELETE_TASK: "bg-red-100 text-red-700",
    CREATE_FEEDBACK: "bg-teal-100 text-teal-700",
  }
  const color = colors[actionType] ?? "bg-gray-100 text-gray-700"
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {formatActionLabel(actionType)}
    </span>
  )
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 20

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [actionTypeFilter, setActionTypeFilter] = useState("")
  const [entityTypeFilter, setEntityTypeFilter] = useState("")

  const loadActivities = useCallback(async () => {
    const params: Record<string, string | number> = { page, limit }
    if (debouncedSearch) params.search = debouncedSearch
    if (actionTypeFilter) params.actionType = actionTypeFilter
    if (entityTypeFilter) params.entityType = entityTypeFilter
    const result = await activityRepository.getActivities(params)
    setActivities(result.activities)
    setTotalPages(result.pagination.totalPages)
    setTotal(result.pagination.total)
    setLoading(false)
  }, [page, debouncedSearch, actionTypeFilter, entityTypeFilter])

  useEffect(() => {
    queueMicrotask(() => void loadActivities())
  }, [loadActivities])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Clock className="size-6" />
          Activity Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Track all actions and changes across the system.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <select
          value={actionTypeFilter}
          onChange={(e) => {
            setPage(1)
            setActionTypeFilter(e.target.value)
          }}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {actionTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={entityTypeFilter}
          onChange={(e) => {
            setPage(1)
            setEntityTypeFilter(e.target.value)
          }}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {entityTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {total > 0 && (
          <p className="text-sm text-muted-foreground">
            {total} entr{total !== 1 ? "ies" : "y"}
          </p>
        )}
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No activity found.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                            {(a.user?.fullName ?? "??")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {a.user?.fullName ?? "System"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionBadge actionType={a.actionType} />
                    </TableCell>
                    <TableCell className="text-xs font-medium uppercase text-muted-foreground">
                      {a.entityType}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {a.description ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
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
  )
}
