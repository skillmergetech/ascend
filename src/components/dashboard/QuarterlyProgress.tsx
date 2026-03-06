"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAscend } from "@/lib/store"
import { Target, ArrowUpRight, TrendingUp } from "lucide-react"

export function QuarterlyProgress() {
  const { goals } = useAscend()
  const quarterlyGoals = goals.filter(g => g.type === "quarterly")
  const completedCount = quarterlyGoals.filter(g => g.completed).length
  const progress = quarterlyGoals.length > 0 ? (completedCount / quarterlyGoals.length) * 100 : 0

  return (
    <Card className="relative overflow-hidden border-none shadow-2xl bg-card/40 backdrop-blur-xl group">
      {/* Background visual element */}
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <TrendingUp size={200} className="text-accent rotate-12" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 items-center">
        <div className="md:col-span-8 p-8 space-y-6">
          <header className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Strategic Vision</h3>
            <CardTitle className="text-3xl font-black font-headline flex items-center gap-3">
              Quarterly Trajectory
              <ArrowUpRight className="h-6 w-6 text-gold animate-bounce" />
            </CardTitle>
          </header>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-5xl font-black text-foreground">{Math.round(progress)}<span className="text-2xl text-accent">%</span></span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aggregate Achievement</p>
            </div>
            <div className="space-y-1">
              <span className="text-5xl font-black text-foreground">{completedCount}<span className="text-2xl text-accent">/</span>{quarterlyGoals.length}</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Targets Reached</p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progress to next milestone</span>
              <span className="text-xs font-bold text-accent">Phase {(progress >= 100) ? 4 : Math.floor(progress / 25) + 1}</span>
            </div>
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative">
               <div 
                 className="h-full ascend-gradient transition-all duration-1000 ease-out relative z-10" 
                 style={{ width: `${progress}%` }}
               >
                 <div className="absolute inset-0 bg-white/20 animate-pulse" />
               </div>
               {/* Vertical markers */}
               <div className="absolute inset-0 flex justify-between px-[25%] opacity-20 pointer-events-none">
                 <div className="h-full w-px bg-white" />
                 <div className="h-full w-px bg-white" />
                 <div className="h-full w-px bg-white" />
               </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 p-8 bg-gradient-to-br from-primary/20 to-accent/20 h-full flex flex-col justify-center border-l border-border/50">
           <div className="space-y-4">
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <p className="text-[10px] font-black text-gold uppercase mb-1">Top Objective</p>
               <p className="text-sm font-bold leading-tight">
                 {quarterlyGoals.length > 0 ? quarterlyGoals[0].title : "Define your first quarterly target to activate tracker."}
               </p>
             </div>
             <p className="text-[10px] text-muted-foreground leading-relaxed italic">
               "Your quarterly goals represent the major milestones of your ascent. Focus on consistent execution to maintain trajectory."
             </p>
           </div>
        </div>
      </div>
    </Card>
  )
}
