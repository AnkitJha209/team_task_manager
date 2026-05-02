import axios from "axios"
import { endpoints } from "@/api/endpoints"
import { getAuthHeaders } from "@/utils/auth"

export type CreateTaskPayload = {
  title: string
  description?: string
  assignedTo?: string
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  dueDate?: string
}

export const getProjectTasks = async (projectId: string) => {
  const response = await axios.get(endpoints.projectTasks(projectId), {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const createTask = async (
  projectId: string,
  payload: CreateTaskPayload
) => {
  const response = await axios.post(
    endpoints.projectTasks(projectId),
    payload,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const updateTaskStatus = async (
  projectId: string,
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
) => {
  const response = await axios.patch(
    endpoints.projectTaskStatus(projectId, taskId),
    { status },
    { headers: getAuthHeaders() }
  )
  return response.data
}
