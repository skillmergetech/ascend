
"use client"

import { useAscend } from "@/lib/store"
import { Zap } from "lucide-react"

export function MomentumGauge() {
  const { momentum } = useAscend()
  
  // Angle calculations for the needle (0 to 180 degrees)
  const angle = (momentum / 100) * 180 - 180

  return (
    <div className="relative flex flex-col items-center justify-center pt-8 pb-4">
      <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-muted/20"
        />
        {/* Progress Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.32"
          strokeDashoffset={251.32 - (momentum / 100) * 251.32}
          className="text-accent transition-all duration-1000 ease-out"
          style={{ filter: "drop-shadow(0 0 4px rgba(14,165,233,0.5))" }}
        />
        {/* Gauge Center Pin */}
        <circle cx="100" cy="100" r="6" className="fill-foreground" />
        {/* Needle */}
        <line
          x1="100" y1="100"
          x2="100" y2="40"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-foreground transition-transform duration-1000 ease-out origin-[100px_100px]"
          style={{ transform: `rotate(${angle}deg)` }}
        />
      </svg>
      
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-accent animate-pulse" />
          <span className="text-4xl font-black italic tracking-tighter">{momentum}</span>
        </div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mt-1">Momentum Core</p>
      </div>
    </div>
  )
}
