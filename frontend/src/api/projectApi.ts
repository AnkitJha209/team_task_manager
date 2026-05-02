import axios from "axios"
import { endpoints } from "@/api/endpoints"
import { getAuthHeaders } from "@/utils/auth"

export type ProjectPayload = {
  name: string
  description?: string
}

export const getProjects = async () => {
  const response = await axios.get(endpoints.projects, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const createProject = async (payload: ProjectPayload) => {
  const response = await axios.post(endpoints.projects, payload, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const updateProject = async (
  projectId: string,
  payload: ProjectPayload
) => {
  const response = await axios.put(endpoints.projectById(projectId), payload, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const deleteProject = async (projectId: string) => {
  const response = await axios.delete(endpoints.projectById(projectId), {
    headers: getAuthHeaders(),
  })
  return response.data
}
