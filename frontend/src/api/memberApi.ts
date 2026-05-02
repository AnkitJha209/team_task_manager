import axios from "axios"
import { endpoints } from "@/api/endpoints"
import { getAuthHeaders } from "@/utils/auth"

export const getProjectMembers = async (projectId: string) => {
  const response = await axios.get(endpoints.projectMembers(projectId), {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const addProjectMember = async (projectId: string, email: string) => {
  const response = await axios.post(
    endpoints.projectMembers(projectId),
    { email },
    { headers: getAuthHeaders() }
  )
  return response.data
}

export const removeProjectMember = async (
  projectId: string,
  memberId: string
) => {
  const response = await axios.delete(
    endpoints.removeProjectMember(projectId, memberId),
    { headers: getAuthHeaders() }
  )
  return response.data
}
