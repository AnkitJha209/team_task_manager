import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AxiosError } from "axios"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getDashboardOverdue,
  getDashboardStats,
  getDashboardTasks,
} from "@/api/dashboardApi"
import { getProjects } from "@/api/projectApi"
import { getProjectTasks } from "@/api/taskApi"
import { getCurrentRole } from "@/utils/auth"
import type { Project, Task } from "@/types"

type StatsResponse = {
  totalTasks?: number
  totalProjects?: number
  assignedTasks?: number
  overDueTasks?: number
}

export const DashboardPage = () => {
  const role = getCurrentRole()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<StatsResponse>({})
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [overdue, setOverdue] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [allProjectTasks, setAllProjectTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const [statsRes, tasksRes, overdueRes] = await Promise.all([
          getDashboardStats(),
          getDashboardTasks(),
          getDashboardOverdue(),
        ])

        setStats(statsRes)
        setMyTasks(tasksRes.tasks || [])
        setOverdue(overdueRes.tasks || [])

        if (role === "ADMIN") {
          const projectRes = await getProjects()
          const projectList = (projectRes.data || []) as Project[]
          setProjects(projectList)

          const taskResults = await Promise.all(
            projectList.map(async (project) => {
              try {
                const response = await getProjectTasks(project.id)
                return (response.tasks || []) as Task[]
              } catch {
                return [] as Task[]
              }
            })
          )

          setAllProjectTasks(taskResults.flat())
        }
      } catch (err) {
        const errorResponse = err as AxiosError<{ message?: string }>
        setError(
          errorResponse.response?.data?.message || "Failed to load dashboard"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [role])

  const adminSummary = useMemo(() => {
    const completed = allProjectTasks.filter(
      (task) => task.status === "COMPLETED"
    ).length
    const inProgress = allProjectTasks.filter(
      (task) => task.status === "IN_PROGRESS" || task.status === "TODO"
    ).length
    const cancelled = allProjectTasks.filter(
      (task) => task.status === "CANCELLED"
    ).length

    return {
      completed,
      inProgress,
      cancelled,
      total: allProjectTasks.length,
    }
  }, [allProjectTasks])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          {role === "ADMIN"
            ? "Overview of active projects, task progress, and delivery status"
            : "Your assigned work, progress, and deadlines"}
        </p>
      </div>

      {error ? (
        <Card className="border-rose-400/40">
          <CardContent className="pt-5 text-sm text-rose-300">
            {error}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle>{stats.totalTasks || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Projects</CardDescription>
            <CardTitle>
              {role === "ADMIN" ? projects.length : stats.totalProjects || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Assigned To Me</CardDescription>
            <CardTitle>{stats.assignedTasks || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Overdue</CardDescription>
            <CardTitle>{stats.overDueTasks || 0}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      {role === "ADMIN" ? (
        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>All Project Tasks</CardDescription>
              <CardTitle>{adminSummary.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>In Progress / Todo</CardDescription>
              <CardTitle>{adminSummary.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Completed</CardDescription>
              <CardTitle>{adminSummary.completed}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>
                Per-project delivery signal based on task states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((project) => {
                const projectTasks = allProjectTasks.filter(
                  (task) => task.projectId === project.id
                )
                const done = projectTasks.filter(
                  (task) => task.status === "COMPLETED"
                ).length
                const state =
                  done === projectTasks.length && projectTasks.length > 0
                    ? "Completed"
                    : projectTasks.length === 0
                      ? "No Tasks"
                      : "Ongoing"

                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {project.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {project.description || "No description"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        state === "Completed"
                          ? "success"
                          : state === "Ongoing"
                            ? "warning"
                            : "default"
                      }
                    >
                      {state}
                    </Badge>
                  </div>
                )
              })}
              {projects.length === 0 ? (
                <p className="text-sm text-slate-400">No projects available.</p>
              ) : null}
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>
              Tasks assigned to you or created by you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading tasks...</p>
            ) : null}
            {!loading && myTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No tasks found.</p>
            ) : null}
            {myTasks.slice(0, 8).map((task) => (
              <div
                key={task.id}
                className="rounded-md border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{task.title}</p>
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
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {task.description || "No description"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Project: {task.projectId}
                  </p>
                  <Link
                    to={`/projects/${task.projectId}/tasks`}
                    className="text-sm text-indigo-300 hover:underline"
                  >
                    View project
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Tasks</CardTitle>
            <CardDescription>Tasks that passed their due date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading overdue tasks...</p>
            ) : null}
            {!loading && overdue.length === 0 ? (
              <p className="text-sm text-slate-400">No overdue tasks.</p>
            ) : null}
            {overdue.map((task) => (
              <div
                key={task.id}
                className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-rose-200">
                    {task.title}
                  </p>
                  <Badge variant="danger">Overdue</Badge>
                </div>
                <p className="mt-1 text-xs text-rose-100/80">
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
