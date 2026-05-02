const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"

export const endpoints = {
  signIn: `${API_BASE}/auth/signIn`,
  signUp: `${API_BASE}/auth/signUp`,
  dashboardTasks: `${API_BASE}/dashboard/tasks`,
  dashboardStats: `${API_BASE}/dashboard/stats`,
  dashboardOverdue: `${API_BASE}/dashboard/overdue`,
  projects: `${API_BASE}/projects`,
  users: `${API_BASE}/users`,
  projectById: (projectId: string) => `${API_BASE}/projects/${projectId}`,
  projectMembers: (projectId: string) =>
    `${API_BASE}/projects/${projectId}/members`,
  removeProjectMember: (projectId: string, memberId: string) =>
    `${API_BASE}/projects/${projectId}/members/${memberId}`,
  projectTasks: (projectId: string) =>
    `${API_BASE}/projects/${projectId}/tasks`,
  projectTaskStatus: (projectId: string, taskId: string) =>
    `${API_BASE}/projects/${projectId}/tasks/${taskId}/status`,
}
