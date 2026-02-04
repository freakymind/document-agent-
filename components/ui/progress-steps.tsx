import { cn } from "@/lib/utils"
import { Check, Circle, Loader2 } from "lucide-react"

interface Step {
  id: string
  label: string
  status: "pending" | "active" | "completed" | "failed"
}

interface ProgressStepsProps {
  steps: Step[]
  className?: string
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                step.status === "completed" && "border-success bg-success text-success-foreground",
                step.status === "active" && "border-primary bg-primary/10 text-primary",
                step.status === "pending" && "border-muted-foreground/30 text-muted-foreground",
                step.status === "failed" && "border-destructive bg-destructive text-destructive-foreground",
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : step.status === "active" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                step.status === "completed" && "text-success",
                step.status === "active" && "text-primary",
                step.status === "pending" && "text-muted-foreground",
                step.status === "failed" && "text-destructive",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn("h-0.5 w-8", step.status === "completed" ? "bg-success" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  )
}
