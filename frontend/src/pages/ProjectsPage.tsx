import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { Link } from "react-router-dom"
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
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/api/projectApi"
import { getCurrentRole } from "@/utils/auth"
import type { Project } from "@/types"

export const ProjectsPage = () => {
  const role = getCurrentRole()
  const isAdmin = role === "ADMIN"
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await getProjects()
      setProjects(response.data || [])
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(
        errorResponse.response?.data?.message || "Failed to fetch projects"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const resetForm = () => {
    setName("")
    setDescription("")
    setEditingId(null)
  }

  const submitProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isAdmin) return

    try {
      if (editingId) {
        await updateProject(editingId, { name, description })
      } else {
        await createProject({ name, description })
      }
      resetForm()
      fetchProjects()
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(
        errorResponse.response?.data?.message || "Failed to save project"
      )
    }
  }

  const startEdit = (project: Project) => {
    setEditingId(project.id)
    setName(project.name)
    setDescription(project.description || "")
  }

  const removeProject = async (projectId: string) => {
    if (!isAdmin) return
    if (!confirm("Delete this project?")) return

    try {
      await deleteProject(projectId)
      fetchProjects()
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(
        errorResponse.response?.data?.message || "Failed to delete project"
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <p className="mt-1 text-sm text-slate-400">
          {isAdmin
            ? "Create, update, and manage projects, members, and tasks"
            : "View your projects and open members/tasks details"}
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
            <CardTitle>
              {editingId ? "Update Project" : "Create Project"}
            </CardTitle>
            <CardDescription>
              Only admins can create and update projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={submitProject}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Button className="rounded-md bg-indigo-500 text-white hover:bg-indigo-400">
                  {editingId ? "Update Project" : "Create Project"}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md border-white/20 bg-transparent text-slate-200 hover:bg-white/10"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading projects...</p>
        ) : null}
        {!loading && projects.length === 0 ? (
          <p className="text-sm text-slate-400">No projects found.</p>
        ) : null}
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {project.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="rounded-md border-white/20 bg-transparent text-slate-100 hover:bg-white/10"
              >
                <Link to={`/projects/${project.id}/members`}>Members</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-md border-white/20 bg-transparent text-slate-100 hover:bg-white/10"
              >
                <Link to={`/projects/${project.id}/tasks`}>Tasks</Link>
              </Button>
              {isAdmin ? (
                <>
                  <Button
                    variant="outline"
                    className="rounded-md border-white/20 bg-transparent text-slate-100 hover:bg-white/10"
                    onClick={() => startEdit(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-md border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                    onClick={() => removeProject(project.id)}
                  >
                    Delete
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
