import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        strict: "border-transparent bg-peach/20 text-foreground",
        flexible: "border-transparent bg-mint/20 text-foreground",
        lavender: "bg-lavender/15 text-foreground border border-lavender/25",
        mint: "bg-mint/15 text-foreground border border-mint/25",
        peach: "bg-peach/15 text-foreground border border-peach/25",
        sky: "bg-sky/15 text-foreground border border-sky/25",
        rose: "bg-rose/15 text-foreground border border-rose/25",
        amber: "bg-amber/15 text-foreground border border-amber/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }