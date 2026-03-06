
"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Milestone {
  value: number
  label: string
}

interface MilestoneProgressProps {
  value: number
  milestones: Milestone[]
  className?: string
}

export function MilestoneProgress({ value, milestones, className }: MilestoneProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative pt-6">
        <Progress value={value} className="h-3 bg-muted/20 overflow-visible" />
        
        {/* Milestone Markers */}
        {milestones.map((m, idx) => {
          const isReached = value >= m.value
          return (
            <div 
              key={idx} 
              className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-500"
              style={{ left: `${m.value}%` }}
            >
              <div className={cn(
                "h-2 w-2 rounded-full mb-1 border-2 transition-all",
                isReached ? "bg-primary border-primary scale-125" : "bg-muted border-muted-foreground/30"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter whitespace-nowrap",
                isReached ? "text-primary" : "text-muted-foreground"
              )}>
                {m.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
