import axios from "axios"
import { endpoints } from "@/api/endpoints"
import { getAuthHeaders } from "@/utils/auth"

export const getUsers = async () => {
  const response = await axios.get(endpoints.users, {
    headers: getAuthHeaders(),
  })
  return response.data
}
