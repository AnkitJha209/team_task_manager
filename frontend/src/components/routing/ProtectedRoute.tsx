import { Navigate, Outlet } from "react-router-dom"
import { getCurrentRole, isLoggedIn, type UserRole } from "@/utils/auth"

type ProtectedRouteProps = {
  requiredRole?: UserRole
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  if (requiredRole) {
    const role = getCurrentRole()
    if (role !== requiredRole) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <Outlet />
}
