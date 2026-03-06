
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 12,
  className,
  label
}: CircularProgressProps) {
  const [offset, setOffset] = useState(0)
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const progressOffset = ((100 - value) / 100) * circumference
    setOffset(progressOffset)
  }, [value, circumference])

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeLinecap="round"
          className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black">{Math.round(value)}%</span>
        {label && <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">{label}</span>}
      </div>
    </div>
  )
}
