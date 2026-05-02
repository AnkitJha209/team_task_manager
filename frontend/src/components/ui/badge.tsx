import * as React from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "danger"

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  danger: "bg-rose-500/20 text-rose-300 border-rose-400/30",
}

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variantClass[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
