import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { useParams } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "@/api/memberApi"
import { getUsers } from "@/api/userApi"
import { getCurrentRole } from "@/utils/auth"
import type { User } from "@/types"

export const ProjectMembersPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const isAdmin = getCurrentRole() === "ADMIN"

  const [members, setMembers] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchData = async () => {
    if (!projectId) return
    setLoading(true)
    setError("")

    try {
      const membersRes = await getProjectMembers(projectId)
      setMembers(membersRes.members || [])

      if (isAdmin) {
        try {
          const usersRes = await getUsers()
          setUsers(usersRes.users || [])
        } catch (err) {
          // don't block members view if users list fails
          console.warn("Failed to fetch users (admin-only):", err)
        }
      }
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(
        errorResponse.response?.data?.message ||
          "Failed to fetch project members"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [projectId])

  const handleAddMember = async (email: string) => {
    if (!projectId || !isAdmin) return

    try {
      await addProjectMember(projectId, email)
      fetchData()
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(errorResponse.response?.data?.message || "Failed to add member")
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId || !isAdmin) return
    if (!confirm("Remove this member from project?")) return

    try {
      await removeProjectMember(projectId, memberId)
      fetchData()
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(
        errorResponse.response?.data?.message || "Failed to remove member"
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Project Members</h1>
        <p className="mt-1 text-sm text-slate-400">
          {isAdmin
            ? "Add or remove members from this project"
            : "View members participating in this project"}
        </p>
      </div>

      {error ? (
        <Card className="border-rose-400/40">
          <CardContent className="pt-5 text-sm text-rose-300">
            {error}
          </CardContent>
        </Card>
      ) : null}

      {isAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Members</CardTitle>
            <CardDescription>
              Click a user to add them to this project
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => {
              const alreadyAdded = members.some(
                (member) => member.id === user.id
              )

              return (
                <button
                  key={user.id}
                  disabled={alreadyAdded}
                  onClick={() => handleAddMember(user.email)}
                  className="rounded-md border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </button>
              )
            })}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
          <CardDescription>
            Members currently attached to this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-slate-400">Loading members...</p>
          ) : null}
          {!loading && members.length === 0 ? (
            <p className="text-sm text-slate-400">
              No members found for this project.
            </p>
          ) : null}
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 p-3"
            >
              <div>
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="text-xs text-slate-400">{member.email}</p>
              </div>
              {isAdmin ? (
                <Button
                  variant="destructive"
                  className="rounded-md border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
