import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ProtectedRoute } from "@/components/routing/ProtectedRoute"
import { DashboardPage } from "@/pages/DashboardPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ProjectMembersPage } from "@/pages/ProjectMembersPage"
import { ProjectsPage } from "@/pages/ProjectsPage"
import { ProjectTasksPage } from "@/pages/ProjectTasksPage"
import { SignInPage } from "@/pages/SignInPage"
import { SignUpPage } from "@/pages/SignUpPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "dashboard", element: <DashboardPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "projects", element: <ProjectsPage /> },
          {
            path: "projects/:projectId/members",
            element: <ProjectMembersPage />,
          },
          { path: "projects/:projectId/tasks", element: <ProjectTasksPage /> },
        ],
      },
      { path: "home", element: <Navigate to="/dashboard" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
