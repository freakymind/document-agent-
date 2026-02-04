import { cn } from "@/lib/utils"

type StatusType =
  | "pending"
  | "documents_uploaded"
  | "processing"
  | "verified"
  | "rejected"
  | "uploaded"
  | "quality_check"
  | "tampering_check"
  | "extracting"
  | "verifying"
  | "completed"
  | "failed"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/20 text-warning" },
  documents_uploaded: { label: "Documents Uploaded", className: "bg-primary/20 text-primary" },
  processing: { label: "Processing", className: "bg-primary/20 text-primary" },
  verified: { label: "Verified", className: "bg-success/20 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive" },
  uploaded: { label: "Uploaded", className: "bg-muted text-muted-foreground" },
  quality_check: { label: "Quality Check", className: "bg-warning/20 text-warning" },
  tampering_check: { label: "Tampering Check", className: "bg-warning/20 text-warning" },
  extracting: { label: "Extracting", className: "bg-primary/20 text-primary" },
  verifying: { label: "Verifying", className: "bg-primary/20 text-primary" },
  completed: { label: "Completed", className: "bg-success/20 text-success" },
  failed: { label: "Failed", className: "bg-destructive/20 text-destructive" },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
