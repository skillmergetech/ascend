"use client"

import { AppShell } from "@/components/layout/Shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAscend } from "@/lib/store"
import { ClipboardCheck, Trophy, Target, Zap, History, ChevronRight, BarChart3, Star, Download, Sparkles } from "lucide-react"
import { useState, useMemo } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from "recharts"
import { cn } from "@/lib/utils"

export default function ReviewPage() {
  const { tasks, goals, finance, reviews, addReview } = useAscend()
  const [reviewType, setReviewType] = useState<"weekly" | "monthly">("weekly")
  
  // Reflection State
  const [wins, setWins] = useState("")
  const [obstacles, setObstacles] = useState("")
  const [improvements, setImprovements] = useState("")
  const [intentions, setIntentions] = useState(["", "", ""])

  // Date Calculation
  const today = new Date()
  const periodStart = new Date()
  if (reviewType === "weekly") {
    periodStart.setDate(today.getDate() - 7)
  } else {
    periodStart.setMonth(today.getMonth() - 1)
  }

  const periodString = periodStart.toISOString().split('T')[0]

  // Stats Aggregation
  const reportStats = useMemo(() => {
    const periodTasks = tasks.filter(t => t.date >= periodString)
    const completedTasks = periodTasks.filter(t => t.completed).length
    const totalTasks = periodTasks.length
    
    // Simplistic XP calc for period (50 per task)
    const xpEarned = completedTasks * 50
    
    // Goals touched in this period
    const touchedGoals = goals.filter(g => g.completed && g.type === (reviewType === "weekly" ? "weekly" : "monthly"))
    
    // Finance
    const totalSpent = finance.expenses
      .filter(e => e.date >= periodString)
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      tasksCompleted: completedTasks,
      tasksTotal: totalTasks,
      goalsCompleted: touchedGoals.length,
      xpEarned,
      totalSpent
    }
  }, [tasks, goals, finance, reviewType, periodString])

  const handleSealReview = () => {
    addReview({
      type: reviewType,
      stats: reportStats,
      reflections: { wins, obstacles, improvements },
      intentions: intentions.filter(i => i.trim() !== "")
    })
    // Reset forms
    setWins("")
    setObstacles("")
    setImprovements("")
    setIntentions(["", "", ""])
  }

  const chartData = [
    { name: "Success", value: reportStats.tasksCompleted, color: "hsl(var(--accent))" },
    { name: "Pending", value: reportStats.tasksTotal - reportStats.tasksCompleted, color: "hsl(var(--muted-foreground)/0.2)" },
  ]

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-black font-headline tracking-tighter uppercase italic">Mission Review</h1>
            </div>
            <p className="text-muted-foreground font-medium">Quantify your execution and refine your strategic approach.</p>
          </div>

          <div className="flex bg-muted/50 p-1 rounded-xl">
            <Button 
              variant={reviewType === "weekly" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setReviewType("weekly")}
              className="rounded-lg px-6 font-bold"
            >
              Weekly
            </Button>
            <Button 
              variant={reviewType === "monthly" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setReviewType("monthly")}
              className="rounded-lg px-6 font-bold"
            >
              Monthly
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Review Section */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={160} />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-black uppercase italic">Deployment Report</CardTitle>
                    <CardDescription>Performance metrics from {periodString} to today.</CardDescription>
                  </div>
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-10 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Missions", value: `${reportStats.tasksCompleted}/${reportStats.tasksTotal}`, icon: Zap, color: "text-accent" },
                    { label: "XP Earned", value: `+${reportStats.xpEarned}`, icon: Trophy, color: "text-gold" },
                    { label: "Goals Hit", value: reportStats.goalsCompleted, icon: Target, color: "text-primary" },
                    { label: "Outflow", value: `$${reportStats.totalSpent}`, icon: Download, color: "text-destructive" },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1 p-4 rounded-2xl bg-muted/20 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted)/0.3)" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} fontWeight="bold" />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px' }} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Reflective Feedback</CardTitle>
                <CardDescription>Analyze your execution patterns and calibrate for the next cycle.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground">Strategic Wins</Label>
                  <Textarea 
                    placeholder="What did you execute perfectly this period?" 
                    value={wins} 
                    onChange={e => setWins(e.target.value)} 
                    className="bg-muted/30 border-none min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground">Operational Obstacles</Label>
                  <Textarea 
                    placeholder="What friction did you encounter?" 
                    value={obstacles} 
                    onChange={e => setObstacles(e.target.value)} 
                    className="bg-muted/30 border-none min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground">Calibration Plan</Label>
                  <Textarea 
                    placeholder="How will you improve your trajectory next cycle?" 
                    value={improvements} 
                    onChange={e => setImprovements(e.target.value)} 
                    className="bg-muted/30 border-none min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-primary/10 shadow-xl overflow-hidden relative">
               <div className="absolute -bottom-10 -right-10 opacity-10">
                 <Sparkles size={160} />
               </div>
               <CardHeader>
                 <CardTitle className="text-lg font-bold">Strategic Intentions</CardTitle>
                 <CardDescription>Lock in your top 3 objectives for the next {reviewType} cycle.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {intentions.map((intent, idx) => (
                   <div key={idx} className="flex gap-4 items-center">
                     <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 font-black text-primary">
                       {idx + 1}
                     </div>
                     <Input 
                        placeholder={`Objective ${idx + 1}...`} 
                        value={intent} 
                        onChange={e => {
                          const newIntents = [...intentions]
                          newIntents[idx] = e.target.value
                          setIntentions(newIntents)
                        }}
                        className="bg-background/50 border-none h-12 font-bold"
                     />
                   </div>
                 ))}
                 <Button onClick={handleSealReview} className="w-full bg-primary py-8 mt-4 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                   Seal Mission Review
                   <ChevronRight className="ml-2 h-5 w-5" />
                 </Button>
               </CardContent>
            </Card>
          </div>

          {/* Review History Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <History className="h-5 w-5 text-accent" />
                  Historical Archive
                </CardTitle>
                <CardDescription>Recent sealed reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reviews.length > 0 ? (
                  reviews.slice().reverse().map(review => (
                    <Card key={review.id} className="border-none bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black uppercase text-primary tracking-widest">{review.type} Report</span>
                          <span className="text-[10px] font-bold text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold truncate">Wins: {review.reflections.wins}</h4>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center gap-1 text-[10px] font-black">
                            <Zap className="h-3 w-3 text-accent" /> {review.stats.tasksCompleted}/{review.stats.tasksTotal}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-black">
                            <Star className="h-3 w-3 text-gold" /> +{review.stats.xpEarned} XP
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-muted rounded-3xl opacity-40">
                    <p className="text-xs font-bold italic">No archived mission reports.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-accent to-primary text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
                 <Trophy size={140} />
               </div>
               <CardContent className="p-8 space-y-4">
                  <h3 className="text-xl font-black italic uppercase">Share Achievement</h3>
                  <p className="text-sm opacity-80 font-medium">Generate a visual summary of your latest cycle to inspire your squad.</p>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black py-6">
                    Download Share-Card
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
