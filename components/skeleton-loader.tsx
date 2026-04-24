import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "circle" | "input"
  count?: number
}

export function Skeleton({
  className,
  variant = "text",
  count = 1,
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted"

  const variantClasses = {
    card: "rounded-lg h-48",
    text: "rounded h-4 w-full",
    circle: "rounded-full h-10 w-10",
    input: "rounded h-10 w-full",
  }

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses[variant], className)}
            {...props}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="card" className="h-40" />
    </div>
  )
}

export function SkeletonProjectCard() {
  return (
    <div className="space-y-3 overflow-hidden rounded-lg border">
      <Skeleton variant="card" className="h-48 rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  )
}
