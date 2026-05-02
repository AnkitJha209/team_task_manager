import { Outlet } from "react-router-dom"
import { AppNavbar } from "@/components/layout/AppNavbar"

export function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),_rgba(2,6,23,1)_65%)] text-white">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        TaskFlow © 2026
      </footer>
    </div>
  )
}

export default App
