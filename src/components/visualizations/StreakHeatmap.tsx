
"use client"

import { useAscend } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function StreakHeatmap() {
  const { tasks } = useAscend()
  
  // Generate last 28 days
  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (27 - i))
    return d.toISOString().split('T')[0]
  })

  const getIntensity = (date: string) => {
    const dailyTasks = tasks.filter(t => t.date === date)
    if (dailyTasks.length === 0) return 0
    const completed = dailyTasks.filter(t => t.completed).length
    return completed / dailyTasks.length
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase text-muted-foreground">Execution History (Last 28 Days)</span>
        <div className="flex gap-1 items-center">
          <div className="h-2 w-2 rounded-sm bg-muted/20" />
          <div className="h-2 w-2 rounded-sm bg-primary/40" />
          <div className="h-2 w-2 rounded-sm bg-primary" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 p-3 rounded-xl bg-muted/5">
        <TooltipProvider>
          {days.map(date => {
            const intensity = getIntensity(date)
            return (
              <Tooltip key={date}>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "aspect-square rounded-sm transition-all hover:scale-110",
                      intensity === 0 ? "bg-muted/20" : 
                      intensity < 0.5 ? "bg-primary/30" :
                      intensity < 1 ? "bg-primary/60" : "bg-primary shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px] font-bold">{date}</p>
                  <p className="text-[10px]">{Math.round(intensity * 100)}% Execution</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
