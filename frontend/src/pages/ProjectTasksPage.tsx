import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getProjectMembers } from "@/api/memberApi"
import { createTask, getProjectTasks, updateTaskStatus } from "@/api/taskApi"
import { getCurrentRole } from "@/utils/auth"
import type { Task, TaskPriority, TaskStatus, User } from "@/types"

const allStatuses: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]
const allPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

export const ProjectTasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const role = getCurrentRole()
  const isAdmin = role === "ADMIN"
  const canUpdateStatus = role === "MEMBER"

  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [status, setStatus] = useState<TaskStatus>("TODO")
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM")
  const [dueDate, setDueDate] = useState("")

  const fetchData = async () => {
    if (!projectId) return

    setLoading(true)
    setError("")
    try {
      const [tasksRes, membersRes] = await Promise.all([
        getProjectTasks(projectId),
        getProjectMembers(projectId),
      ])
      setTasks(tasksRes.tasks || [])
      setMembers(membersRes.members || [])
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(errorResponse.response?.data?.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [projectId])

  const submitTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!projectId || !isAdmin) return

    try {
      await createTask(projectId, {
        title,
        description,
        assignedTo: assignedTo || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      })

      setTitle("")
      setDescription("")
      setAssignedTo("")
      setStatus("TODO")
      setPriority("MEDIUM")
      setDueDate("")
      fetchData()
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(errorResponse.response?.data?.message || "Failed to create task")
    }
  }

  const changeStatus = async (taskId: string, nextStatus: TaskStatus) => {
    if (!projectId || !canUpdateStatus) return

    try {
      await updateTaskStatus(projectId, taskId, nextStatus)
      fetchData()
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(
        errorResponse.response?.data?.message || "Failed to update task status"
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Project Tasks</h1>
        <p className="mt-1 text-sm text-slate-400">
          {isAdmin
            ? "Create tasks and assign them to project members"
            : "View tasks and update status for your task workflow"}
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
            <CardTitle>Create Task</CardTitle>
            <CardDescription>
              Only admins can create tasks in a project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={submitTask}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <div className="space-y-2 xl:col-span-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assign To</Label>
                <select
                  id="task-assignee"
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                      className="bg-slate-900 text-white"
                    >
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2 xl:col-span-3">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as TaskStatus)
                  }
                  className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  {allStatuses.map((value) => (
                    <option
                      key={value}
                      value={value}
                      className="bg-slate-900 text-white"
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as TaskPriority)
                  }
                  className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  {allPriorities.map((value) => (
                    <option
                      key={value}
                      value={value}
                      className="bg-slate-900 text-white"
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
              <div className="md:col-span-2 xl:col-span-3">
                <Button className="rounded-md bg-indigo-500 text-white hover:bg-indigo-400">
                  Create Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>All tasks in this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-slate-400">Loading tasks...</p>
          ) : null}
          {!loading && tasks.length === 0 ? (
            <p className="text-sm text-slate-400">
              No tasks found for this project.
            </p>
          ) : null}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-md border border-white/10 bg-white/5 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">{task.title}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      task.status === "COMPLETED"
                        ? "success"
                        : task.status === "CANCELLED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {task.status}
                  </Badge>
                  <Badge>{task.priority}</Badge>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {task.description || "No description"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Assigned: {task.assignedTo?.name || "Unassigned"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>

              {canUpdateStatus ? (
                <div className="mt-3">
                  <Label htmlFor={`status-${task.id}`}>Update Status</Label>
                  <select
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={(event) =>
                      changeStatus(task.id, event.target.value as TaskStatus)
                    }
                    className="mt-1 h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                  >
                    {allStatuses.map((value) => (
                      <option
                        key={value}
                        value={value}
                        className="bg-slate-900 text-white"
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
