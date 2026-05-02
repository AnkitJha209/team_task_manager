export type UserRole = "ADMIN" | "MEMBER"

type TokenPayload = {
  id?: string
  role?: UserRole
  exp?: number
  iat?: number
}

export const getToken = () => localStorage.getItem("token")

export const getAuthHeaders = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const clearAuth = () => {
  localStorage.removeItem("token")
}

export const decodeTokenPayload = (): TokenPayload | null => {
  const token = getToken()
  if (!token) return null

  try {
    const parts = token.split(".")
    if (parts.length < 2) return null

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const decoded = atob(base64)
    return JSON.parse(decoded) as TokenPayload
  } catch {
    return null
  }
}

export const getCurrentRole = (): UserRole | null => {
  const payload = decodeTokenPayload()
  if (payload?.role === "ADMIN" || payload?.role === "MEMBER") {
    return payload.role
  }
  return null
}

export const isLoggedIn = () => Boolean(getToken())
