"use client"

import { AppShell } from "@/components/layout/Shell"
import { QuarterlyProgress } from "@/components/dashboard/QuarterlyProgress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAscend } from "@/lib/store"
import { Zap, Trophy, TrendingUp, Calendar, CheckSquare, Plus, ArrowUp, Star, ChevronRight, Flame } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { momentum, streak, tasks, goals, level, xp, addTask, toggleTask } = useAscend()
  const { toast } = useToast()
  const [quickTask, setQuickTask] = useState("")

  const nextLevelXp = level * 1000
  const xpProgress = (xp / nextLevelXp) * 100

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.date === today)
  const prioritizedTasks = todayTasks.slice(0, 5)
  const completedToday = todayTasks.filter(t => t.completed).length

  const handleQuickAdd = () => {
    if (!quickTask.trim()) return
    addTask({
      title: quickTask,
      date: today
    })
    setQuickTask("")
    toast({
      title: "Mission Logged",
      description: "Priority established.",
    })
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Level and XP Header Card */}
        <section className="animate-rise">
           <Card className="border-none bg-gradient-to-r from-primary/10 via-accent/5 to-transparent backdrop-blur-xl shadow-xl overflow-hidden relative group">
             <div className="absolute inset-0 ascend-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
             <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-gold shadow-gold flex items-center justify-center bg-background z-10 relative">
                    <span className="text-4xl font-black text-foreground">{level}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Star className="h-4 w-4 fill-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Ascension Rank: {level}</h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mastering Execution</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-primary uppercase">{xp} / {nextLevelXp} XP</span>
                    </div>
                  </div>
                  <Progress value={xpProgress} className="h-3 bg-primary/10 shadow-inner" />
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
                      <span className="text-sm font-black text-foreground">{streak} Day Streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary fill-primary/20" />
                      <span className="text-sm font-black text-foreground">{momentum} Momentum</span>
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" className="border-gold/30 hover:bg-gold/10 hover:border-gold font-black uppercase text-xs">
                  <Link href="/rewards">Visit Honor Hall</Link>
                </Button>
             </CardContent>
           </Card>
        </section>

        {/* Hero Section: Quarterly Vision */}
        <section className="animate-rise" style={{ animationDelay: '0.1s' }}>
          <QuarterlyProgress />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Execution & Momentum */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Today's Prioritized Tasks */}
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-accent" />
                  High Priority Focus
                </CardTitle>
                <span className="text-xs font-black text-muted-foreground uppercase">{completedToday} / {todayTasks.length} Done</span>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Add Input */}
                <div className="flex gap-2 mb-6">
                  <Input 
                    placeholder="Fast log next objective..." 
                    className="bg-muted/50 border-none focus-visible:ring-accent"
                    value={quickTask}
                    onChange={(e) => setQuickTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                  />
                  <Button size="icon" onClick={handleQuickAdd} className="bg-accent hover:bg-accent/90 shrink-0">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {prioritizedTasks.length > 0 ? (
                    prioritizedTasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border border-border/50 cursor-pointer transition-all duration-300 hover:bg-muted/20 ${task.completed ? 'opacity-40 grayscale' : 'hover:border-accent/30'}`}
                      >
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-accent border-accent text-white' : 'border-muted-foreground'}`}>
                          {task.completed && <Plus className="h-4 w-4 rotate-45" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                          {task.goalId && (
                            <span className="text-[10px] font-black text-accent uppercase tracking-tighter">
                              Linked to: {goals.find(g => g.id === task.goalId)?.title}
                            </span>
                          )}
                        </div>
                        {!task.completed && <ArrowUp className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-muted rounded-3xl">
                      <p className="text-muted-foreground text-sm">No missions defined for today.</p>
                      <Button variant="link" className="text-accent text-xs mt-2" onClick={() => document.querySelector('input')?.focus()}>
                        Initialize first objective
                      </Button>
                    </div>
                  )}
                </div>

                {todayTasks.length > 5 && (
                  <Link href="/tasks" className="block text-center text-xs font-bold text-accent hover:underline mt-4">
                    View all {todayTasks.length} daily missions
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Goal Cascade & Achievements */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Goal Cascade Preview */}
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute left-6 top-16 bottom-16 w-px bg-gradient-to-b from-primary via-accent to-transparent opacity-30" />
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-gold" />
                  Active Cascade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="relative pl-10 group">
                    <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-background border-2 border-primary group-hover:border-accent transition-colors z-10 flex items-center justify-center">
                       <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{goal.type}</span>
                      <h4 className="text-sm font-bold text-foreground mt-1 line-clamp-2">{goal.title}</h4>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={goal.progress} className="h-1 flex-1" />
                        <span className="text-[10px] font-bold text-muted-foreground">{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                {goals.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4 italic">The cascade is silent. Define your vision.</p>
                )}
                <Link href="/goals" className="flex items-center justify-center gap-2 text-xs font-black text-accent uppercase hover:gap-3 transition-all">
                  Vision Blueprint
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Recent Honors */}
            <Card className="border-none bg-gradient-to-br from-primary/20 to-accent/10 backdrop-blur-xl shadow-2xl border-l-4 border-gold">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Recent Honors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {useAscend().achievements.filter(a => a.unlockedAt).slice(-3).map(achievement => (
                     <div key={achievement.id} className="flex gap-3 items-start animate-rise">
                      <div className="h-8 w-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0 shadow-gold">
                        <Trophy className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{achievement.title}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  {useAscend().achievements.filter(a => a.unlockedAt).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-[10px] font-bold text-muted-foreground italic">Execute today to unlock your first honor.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
