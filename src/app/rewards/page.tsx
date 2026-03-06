"use client"

import { AppShell } from "@/components/layout/Shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAscend, Achievement } from "@/lib/store"
import { Trophy, Star, Zap, Flame, Target, Layers, Lock, CheckCircle2, Award } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RewardsPage() {
  const { achievements, xp, level } = useAscend()

  const nextLevelXp = level * 1000
  const xpProgress = (xp / nextLevelXp) * 100

  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: cn("h-8 w-8", unlocked ? "text-gold" : "text-muted-foreground") }
    switch (iconName) {
      case "Zap": return <Zap {...props} />
      case "Flame": return <Flame {...props} />
      case "Trophy": return <Trophy {...props} />
      case "Layers": return <Layers {...props} />
      case "Target": return <Target {...props} />
      default: return <Award {...props} />
    }
  }

  const categories = [
    { name: "Execution", id: "execution", icon: Zap },
    { name: "Vision", id: "vision", icon: Target },
    { name: "Strategy", id: "strategy", icon: Layers },
  ]

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <Trophy className="h-12 w-12 text-gold animate-pulse" />
            <h1 className="text-4xl font-black font-headline tracking-tighter uppercase italic">Honor Hall</h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium">Your achievements define your trajectory. Earn XP and level up your operational efficiency.</p>
        </header>

        {/* Level Overview */}
        <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-primary/5 overflow-hidden">
          <div className="p-8 grid grid-cols-1 md:grid-cols-12 items-center gap-8">
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
               <div className="h-32 w-32 rounded-full border-8 border-gold/20 flex items-center justify-center relative shadow-gold">
                 <div className="absolute inset-0 rounded-full border-4 border-gold animate-spin-slow opacity-30" />
                 <span className="text-6xl font-black text-foreground">{level}</span>
               </div>
               <div className="space-y-1">
                 <h2 className="text-2xl font-black uppercase text-gold">High Achiever</h2>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Operational Level</p>
               </div>
            </div>
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase text-primary">Experience Points (XP)</span>
                  <span className="text-lg font-black text-foreground">{xp} / {nextLevelXp}</span>
                </div>
                <Progress value={xpProgress} className="h-4 bg-primary/10" />
                <p className="text-xs text-muted-foreground font-medium italic">Gain {nextLevelXp - xp} more XP to reach Level {level + 1}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">{achievements.filter(a => a.unlockedAt).length}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Achievements</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">{(xp + (level - 1) * 1000).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Lifetime XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">Top 1%</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Efficiency Rank</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievement Grid */}
        <div className="space-y-10">
          {categories.map(cat => (
            <section key={cat.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                <cat.icon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-black uppercase tracking-wider">{cat.name} Achievements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.filter(a => a.category === cat.id).map(achievement => {
                  const unlocked = !!achievement.unlockedAt
                  return (
                    <Card key={achievement.id} className={cn(
                      "border-none shadow-lg transition-all duration-500 overflow-hidden",
                      unlocked ? "bg-card/40 hover:scale-[1.03]" : "opacity-40 bg-muted/20 grayscale"
                    )}>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border-2",
                          unlocked ? "border-gold/50 bg-gold/10 shadow-gold" : "border-muted-foreground/20"
                        )}>
                          {unlocked ? getIcon(achievement.icon, true) : <Lock className="h-8 w-8 text-muted-foreground/50" />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-foreground uppercase tracking-tight">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{achievement.description}</p>
                          {unlocked && (
                            <div className="flex items-center gap-1.5 pt-2">
                              <CheckCircle2 className="h-3 w-3 text-gold" />
                              <span className="text-[10px] font-black text-gold uppercase">Unlocked: {new Date(achievement.unlockedAt!).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
