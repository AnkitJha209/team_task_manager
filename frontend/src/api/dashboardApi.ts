import axios from "axios"
import { endpoints } from "@/api/endpoints"
import { getAuthHeaders } from "@/utils/auth"

export const getDashboardTasks = async () => {
  const response = await axios.get(endpoints.dashboardTasks, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getDashboardStats = async () => {
  const response = await axios.get(endpoints.dashboardStats, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getDashboardOverdue = async () => {
  const response = await axios.get(endpoints.dashboardOverdue, {
    headers: getAuthHeaders(),
  })
  return response.data
}
