export type UserRole = "ADMIN" | "MEMBER"

export type User = {
  id: string
  name: string
  email: string
  role?: UserRole
}

export type Project = {
  id: string
  name: string
  description?: string | null
  ownerId: string
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type Task = {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  projectId: string
  assignedTo?: {
    id: string
    name: string
    email: string
  } | null
}
