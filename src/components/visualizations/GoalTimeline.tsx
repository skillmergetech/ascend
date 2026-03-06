
"use client"

import { useAscend, Goal } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Target, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function GoalTimeline() {
  const { goals } = useAscend()
  
  // Sort goals by target date if available, then by type priority
  const typePriority = { yearly: 5, biannual: 4, quarterly: 3, monthly: 2, weekly: 1 }
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.targetDate && b.targetDate) return a.targetDate.localeCompare(b.targetDate)
    return typePriority[b.type] - typePriority[a.type]
  }).slice(0, 6)

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-muted rounded-3xl opacity-40">
        <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-bold">The timeline is empty. Define your vision.</p>
      </div>
    )
  }

  return (
    <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-accent before:to-transparent">
      {sortedGoals.map((goal, idx) => (
        <div key={goal.id} className="relative group animate-rise" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className={cn(
            "absolute -left-8 top-1 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center z-10 transition-all group-hover:scale-125",
            goal.completed ? "border-primary bg-primary text-white" : "border-muted-foreground/30 text-muted-foreground"
          )}>
            <div className={cn("h-2 w-2 rounded-full", goal.completed ? "bg-white" : "bg-muted-foreground/30")} />
          </div>
          
          <Card className="border-none shadow-md bg-card/40 backdrop-blur-md overflow-hidden hover:bg-card/60 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest">{goal.type}</span>
                  {goal.targetDate && (
                    <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {goal.targetDate}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm truncate max-w-[200px]">{goal.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-primary">{Math.round(goal.progress)}%</span>
                <div className="h-1 w-16 bg-muted rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      {goals.length > 6 && (
        <div className="text-center pt-2">
          <button className="text-[10px] font-black uppercase text-accent hover:underline flex items-center justify-center mx-auto gap-1">
            View All Strategy Points <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}
