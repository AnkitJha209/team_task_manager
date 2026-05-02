import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="max-w-md text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Button
        asChild
        className="rounded-md bg-indigo-500 text-white hover:bg-indigo-400"
      >
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
