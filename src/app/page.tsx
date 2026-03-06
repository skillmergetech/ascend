"use client"

import { AppShell } from "@/components/layout/Shell"
import { QuarterlyProgress } from "@/components/dashboard/QuarterlyProgress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAscend } from "@/lib/store"
import { Zap, Trophy, TrendingUp, Calendar, Wallet, CheckSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function Dashboard() {
  const { momentum, streak, tasks, goals, finance } = useAscend()
  
  const todayTasks = tasks.filter(t => t.date === new Date().toISOString().split('T')[0])
  const completedToday = todayTasks.filter(t => t.completed).length
  const taskProgress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Main Progress */}
        <div className="md:col-span-8 space-y-6">
          <QuarterlyProgress />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Momentum</CardTitle>
                <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-4">{momentum} <span className="text-sm font-normal text-muted-foreground">pts</span></div>
                <Progress value={momentum} className="h-1" />
                <p className="mt-2 text-xs text-muted-foreground">Keep completing tasks to stay in flow</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Streak</CardTitle>
                <Trophy className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-4">{streak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div 
                      key={day} 
                      className={`h-1.5 flex-1 rounded-full ${day <= (streak % 7 || (streak > 0 ? 7 : 0)) ? 'bg-primary' : 'bg-primary/10'}`} 
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Current consistency marathon</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Active Goals Cascade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="group relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-primary px-2 py-0.5 rounded-full bg-primary/10">
                        {goal.type}
                      </span>
                      {goal.completed && <Trophy className="h-4 w-4 text-accent" />}
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{goal.title}</h3>
                  </div>
                ))}
                {goals.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground text-sm italic">No goals defined yet. Start your journey today.</p>
                    <Link href="/goals" className="text-primary font-bold text-sm mt-2 block hover:underline">Create a goal &rarr;</Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Side Panels */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckSquare size={100} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Today's Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black mb-4">{completedToday}/{todayTasks.length}</div>
              <Progress value={taskProgress} className="h-2 bg-white/20" />
              <Link href="/tasks" className="mt-6 block text-center py-2 rounded-lg bg-white text-primary font-bold text-sm hover:bg-white/90 transition-colors">
                Manage Daily Tasks
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Budget Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              {finance.monthlyIncome > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Needs (25%)</span>
                    <span className="font-bold">${finance.allocations.dailyNeeds.toFixed(0)}</span>
                  </div>
                  <Progress value={25} className="h-1.5" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Investments (20%)</span>
                    <span className="font-bold">${finance.allocations.investments.toFixed(0)}</span>
                  </div>
                  <Progress value={20} className="h-1.5" />
                  
                  <Link href="/finance" className="text-primary font-bold text-sm mt-4 block hover:underline">View full breakdown &rarr;</Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">Set your monthly income to see your budget allocation.</p>
                  <Link href="/finance" className="text-primary font-bold text-sm hover:underline">Setup Finance &rarr;</Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
