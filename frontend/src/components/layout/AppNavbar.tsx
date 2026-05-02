import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { clearAuth, isLoggedIn } from "@/utils/auth"

export const AppNavbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [location])

  if (!loggedIn) {
    return null
  }

  const logout = () => {
    clearAuth()
    setLoggedIn(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <p className="text-lg font-semibold text-white">TaskFlow</p>
          <nav className="hidden items-center gap-4 sm:flex">
            <Link
              to="/dashboard"
              className="text-sm text-slate-300 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="text-sm text-slate-300 hover:text-white"
            >
              Projects
            </Link>
          </nav>
        </div>
        <Button
          variant="outline"
          className="rounded-md border-white/20 bg-transparent px-3 text-slate-100 hover:bg-white/10"
          onClick={logout}
        >
          Log out
        </Button>
      </div>
    </header>
  )
}
