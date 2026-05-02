import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/api/authApi"

export const SignInPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await signIn({ email, password })
      localStorage.setItem("token", data.accessToken)
      navigate("/dashboard")
    } catch (err) {
      const errorResponse = err as AxiosError<{ message?: string }>
      setError(errorResponse.response?.data?.message || "Unable to sign in")
    } finally {
      setLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setEmail("adminTest@mail.com")
    setPassword("Admin123")
  }

  const fillMemberCredentials = () => {
    setEmail("khushi@gmail.com")
    setPassword("Ankit123")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
          <CardDescription className="text-center">
            Access your workspace and manage your tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                type="password"
                required
              />
            </div>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <Button
              className="h-10 w-full rounded-md bg-indigo-500 text-white hover:bg-indigo-400"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-slate-400">
              No account?{" "}
              <Link
                to="/sign-up"
                className="text-indigo-300 hover:text-indigo-200"
              >
                Create one
              </Link>
            </p>
          </form>

          <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
            <p className="text-xs font-medium text-slate-400">
              Quick login with demo credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={fillAdminCredentials}
                variant="outline"
                className="rounded-md border-white/20 bg-transparent text-slate-200 hover:bg-white/10"
              >
                Login as Admin
              </Button>
              <Button
                onClick={fillMemberCredentials}
                variant="outline"
                className="rounded-md border-white/20 bg-transparent text-slate-200 hover:bg-white/10"
              >
                Login as Member
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
