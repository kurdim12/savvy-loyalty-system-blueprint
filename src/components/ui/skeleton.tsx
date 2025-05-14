
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Add component for fullscreen skeleton loading state
function FullPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-[#FAF6F0]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
      <div className="space-y-2 text-center">
        <Skeleton className="h-4 w-[250px] bg-[#8B4513]/20 mx-auto" />
        <Skeleton className="h-4 w-[200px] bg-[#8B4513]/20 mx-auto" />
      </div>
    </div>
  )
}

// Add dashboard specific loading state
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[200px] bg-[#8B4513]/20" />
          <Skeleton className="h-4 w-[300px] bg-[#8B4513]/20 mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-[100px] bg-[#8B4513]/20" />
          <Skeleton className="h-6 w-[80px] bg-[#8B4513]/20" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 border-[#8B4513]/20">
            <Skeleton className="h-6 w-[140px] bg-[#8B4513]/20" />
            <Skeleton className="h-4 w-[100px] bg-[#8B4513]/20 mt-2" />
            <div className="mt-4 space-y-2">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-4 w-full bg-[#8B4513]/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Skeleton, FullPageSkeleton, DashboardSkeleton }
