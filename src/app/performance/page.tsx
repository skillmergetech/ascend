
"use client"

import { AppShell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  CircularProgress, 
  MilestoneProgress, 
  StreakHeatmap, 
  MomentumGauge, 
  GoalTimeline, 
  AchievementTimeline 
} from "@/components/visualizations"
import { useAscend } from "@/lib/store"
import { Activity, BarChart3, Target, Award, Zap, TrendingUp, History } from "lucide-react"

export default function PerformancePage() {
  const { xp, level, goals, tasks } = useAscend()
  
  const nextLevelXp = level * 1000
  const xpProgress = (xp / nextLevelXp) * 100
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Activity className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-black font-headline tracking-tighter uppercase italic">Performance Hub</h1>
            </div>
            <p className="text-muted-foreground font-medium">Real-time analytical breakdown of your operational efficiency.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Level & Momentum Column */}
          <div className="md:col-span-4 space-y-8">
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={160} />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Velocity Core
                </CardTitle>
                <CardDescription>Current operational force.</CardDescription>
              </CardHeader>
              <CardContent>
                <MomentumGauge />
              </CardContent>
            </Card>

            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Rank Progression</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 pt-4">
                <CircularProgress 
                  value={xpProgress} 
                  size={160} 
                  strokeWidth={16} 
                  label={`Level ${level}`}
                />
                <div className="w-full space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                    <span>Rank: Novice Achiever</span>
                    <span>{xp} / {nextLevelXp} XP</span>
                  </div>
                  <MilestoneProgress 
                    value={xpProgress} 
                    milestones={[
                      { value: 25, label: "Phase I" },
                      { value: 50, label: "Phase II" },
                      { value: 75, label: "Phase III" },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity & History Column */}
          <div className="md:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StreakHeatmap />
                </CardContent>
              </Card>

              <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Mission Success
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center pt-4">
                  <CircularProgress 
                    value={taskCompletionRate} 
                    size={140} 
                    strokeWidth={14} 
                    label="Lifetime"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Strategy Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoalTimeline />
                </CardContent>
              </Card>

              <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Award className="h-5 w-5 text-gold" />
                    Honor Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AchievementTimeline />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
