
"use client"

import { useAscend, Achievement } from "@/lib/store"
import { Trophy, Star, Zap, Flame, Target, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export function AchievementTimeline() {
  const { achievements } = useAscend()
  const unlocked = achievements.filter(a => a.unlockedAt).sort((a, b) => 
    new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
  )

  const getIcon = (iconName: string) => {
    const props = { className: "h-4 w-4 text-gold" }
    switch (iconName) {
      case "Zap": return <Zap {...props} />
      case "Flame": return <Flame {...props} />
      case "Trophy": return <Trophy {...props} />
      case "Layers": return <Layers {...props} />
      case "Target": return <Target {...props} />
      default: return <Star {...props} />
    }
  }

  if (unlocked.length === 0) {
    return (
      <div className="text-center py-12 bg-gold/5 border-2 border-dashed border-gold/20 rounded-3xl">
        <Trophy className="h-12 w-12 mx-auto mb-3 text-gold/20" />
        <p className="text-sm font-bold text-muted-foreground">No honors unlocked yet.</p>
        <p className="text-[10px] uppercase font-black text-gold/50 mt-1">Execute missions to earn recognition</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {unlocked.map((a, idx) => (
        <div key={a.id} className="flex gap-4 group animate-rise" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/30 shadow-gold group-hover:scale-110 transition-all">
              {getIcon(a.icon)}
            </div>
            {idx !== unlocked.length - 1 && <div className="w-px h-full bg-gold/20 my-2" />}
          </div>
          <div className="flex-1 pt-1 pb-4">
            <span className="text-[9px] font-black uppercase text-gold tracking-widest">{new Date(a.unlockedAt!).toLocaleDateString()}</span>
            <h4 className="font-black text-sm uppercase italic tracking-tighter text-foreground">{a.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
