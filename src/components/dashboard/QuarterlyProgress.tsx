"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAscend } from "@/lib/store"
import { Target, ArrowUpRight } from "lucide-react"

export function QuarterlyProgress() {
  const { goals } = useAscend()
  const quarterlyGoals = goals.filter(g => g.type === "quarterly")
  const completedCount = quarterlyGoals.filter(g => g.completed).length
  const progress = quarterlyGoals.length > 0 ? (completedCount / quarterlyGoals.length) * 100 : 0

  return (
    <Card className="relative overflow-hidden border-none shadow-xl shadow-primary/5">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Target size={120} className="text-primary rotate-12" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Target className="h-5 w-5 text-primary" />
          Quarterly Momentum
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-4xl font-black text-primary">{Math.round(progress)}%</span>
            <p className="text-sm font-medium text-muted-foreground">Achievement Rate</p>
          </div>
          <div className="flex items-center gap-1 text-accent font-bold text-sm bg-accent/10 px-2 py-1 rounded-full">
            <ArrowUpRight className="h-4 w-4" />
            +12% vs last Q
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Progress toward targets</span>
            <span>{completedCount} of {quarterlyGoals.length} goals</span>
          </div>
          <Progress value={progress} className="h-3 bg-primary/10">
            <div className="upward-gradient absolute inset-0" />
          </Progress>
        </div>
      </CardContent>
    </Card>
  )
}
