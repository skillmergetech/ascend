"use client"

import { AppShell } from "@/components/layout/Shell"
import { QuarterlyProgress } from "@/components/dashboard/QuarterlyProgress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAscend } from "@/lib/store"
import { Zap, Trophy, TrendingUp, Calendar, CheckSquare, Plus, ArrowUp, Star, ChevronRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { momentum, streak, tasks, goals, addTask, toggleTask } = useAscend()
  const { toast } = useToast()
  const [quickTask, setQuickTask] = useState("")

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.date === today)
  const prioritizedTasks = todayTasks.slice(0, 5)
  const completedToday = todayTasks.filter(t => t.completed).length
  const taskProgress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0

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
        {/* Hero Section: Quarterly Vision */}
        <section className="animate-rise">
          <QuarterlyProgress />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Execution & Momentum */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Momentum & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 ascend-gradient opacity-10 blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Momentum Core
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-foreground">{momentum}</span>
                    <span className="text-sm font-bold text-muted-foreground">/ 100</span>
                  </div>
                  <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full ascend-gradient transition-all duration-1000" 
                      style={{ width: `${momentum}%` }}
                    />
                  </div>
                  <p className="mt-4 text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    Achieving at high velocity
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold opacity-5 blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold" />
                    Consistency Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-foreground">{streak}</span>
                    <span className="text-sm font-bold text-muted-foreground">Days</span>
                  </div>
                  <div className="mt-4 flex gap-1.5">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 flex-1 rounded-full ${i < (streak % 7 || (streak > 0 ? 7 : 0)) ? 'bg-gold shadow-gold' : 'bg-muted'}`} 
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">The chain remains unbroken</p>
                </CardContent>
              </Card>
            </div>

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
                {goals.slice(0, 3).map((goal, idx) => (
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

            {/* Achievements Area */}
            <Card className="border-none bg-gradient-to-br from-primary/20 to-accent/10 backdrop-blur-xl shadow-2xl border-l-4 border-gold">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Honors List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {momentum > 50 && (
                    <div className="flex gap-3 items-start animate-rise">
                      <div className="h-8 w-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                        <Zap className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Flow State Achieved</p>
                        <p className="text-[10px] text-muted-foreground">Momentum sustained above critical threshold.</p>
                      </div>
                    </div>
                  )}
                  {streak > 3 && (
                    <div className="flex gap-3 items-start animate-rise" style={{ animationDelay: '0.1s' }}>
                      <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Unstoppable Discipline</p>
                        <p className="text-[10px] text-muted-foreground">{streak} days of consistent execution.</p>
                      </div>
                    </div>
                  )}
                  {momentum <= 50 && streak <= 3 && (
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
