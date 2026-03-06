"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

export type GoalType = "weekly" | "monthly" | "quarterly" | "biannual" | "yearly"

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt?: string
  icon: string
  category: "execution" | "vision" | "strategy"
}

export interface Goal {
  id: string
  title: string
  description?: string
  targetDate?: string
  outcome?: string
  icon?: string
  type: GoalType
  completed: boolean
  parentId?: string
  progress: number
}

export interface Task {
  id: string
  title: string
  completed: boolean
  goalId?: string
  date: string
}

export interface FinanceData {
  monthlyIncome: number
  allocations: {
    tithe: number
    savings: number
    charity: number
    investments: number
    dailyNeeds: number
  }
}

interface AscendStore {
  goals: Goal[]
  tasks: Task[]
  finance: FinanceData
  momentum: number
  streak: number
  xp: number
  level: number
  achievements: Achievement[]
  settings: {
    mute: boolean
  }
  addGoal: (goal: Omit<Goal, "id" | "progress" | "completed">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  toggleGoal: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed">) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  setIncome: (income: number) => void
  toggleMute: () => void
}

const DEFAULT_FINANCE: FinanceData = {
  monthlyIncome: 0,
  allocations: {
    tithe: 0,
    savings: 0,
    charity: 0,
    investments: 0,
    dailyNeeds: 0,
  },
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_task", title: "Initiated", description: "Complete your first daily mission.", icon: "Zap", category: "execution" },
  { id: "streak_7", title: "Disciplined", description: "Maintain a 7-day consistency streak.", icon: "Flame", category: "execution" },
  { id: "streak_30", title: "Unstoppable", description: "Maintain a 30-day consistency streak.", icon: "Trophy", category: "execution" },
  { id: "cascade_5", title: "Architect", description: "Link 5 goals in your strategic cascade.", icon: "Layers", category: "strategy" },
  { id: "quarterly_1", title: "Visionary", description: "Reach your first quarterly milestone.", icon: "Target", category: "vision" },
]

const AscendContext = createContext<AscendStore | undefined>(undefined)

export function AscendProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [finance, setFinance] = useState<FinanceData>(DEFAULT_FINANCE)
  const [momentum, setMomentum] = useState(0)
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)
  const [settings, setSettings] = useState({ mute: false })
  const [hydrated, setHydrated] = useState(false)

  const XP_PER_TASK = 50
  const XP_PER_GOAL = 500
  const getNextLevelXp = (lvl: number) => lvl * 1000

  useEffect(() => {
    const stored = localStorage.getItem("ascend_data_v2")
    if (stored) {
      const parsed = JSON.parse(stored)
      setGoals(parsed.goals || [])
      setTasks(parsed.tasks || [])
      setFinance(parsed.finance || DEFAULT_FINANCE)
      setMomentum(parsed.momentum || 0)
      setStreak(parsed.streak || 0)
      setXp(parsed.xp || 0)
      setLevel(parsed.level || 1)
      setAchievements(parsed.achievements || INITIAL_ACHIEVEMENTS)
      setSettings(parsed.settings || { mute: false })
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("ascend_data_v2", JSON.stringify({ 
        goals, tasks, finance, momentum, streak, xp, level, achievements, settings 
      }))
    }
  }, [goals, tasks, finance, momentum, streak, xp, level, achievements, settings, hydrated])

  const checkAchievements = useCallback(() => {
    const newAchievements = [...achievements]
    let updated = false

    // First Task
    if (!newAchievements.find(a => a.id === "first_task")?.unlockedAt && tasks.some(t => t.completed)) {
      const idx = newAchievements.findIndex(a => a.id === "first_task")
      newAchievements[idx].unlockedAt = new Date().toISOString()
      updated = true
      triggerAchievementUI(newAchievements[idx])
    }

    // Streak 7
    if (!newAchievements.find(a => a.id === "streak_7")?.unlockedAt && streak >= 7) {
      const idx = newAchievements.findIndex(a => a.id === "streak_7")
      newAchievements[idx].unlockedAt = new Date().toISOString()
      updated = true
      triggerAchievementUI(newAchievements[idx])
    }

    // Cascade 5
    const linkedGoalsCount = goals.filter(g => g.parentId).length
    if (!newAchievements.find(a => a.id === "cascade_5")?.unlockedAt && linkedGoalsCount >= 5) {
      const idx = newAchievements.findIndex(a => a.id === "cascade_5")
      newAchievements[idx].unlockedAt = new Date().toISOString()
      updated = true
      triggerAchievementUI(newAchievements[idx])
    }

    if (updated) setAchievements(newAchievements)
  }, [achievements, tasks, streak, goals])

  const triggerAchievementUI = (achievement: Achievement) => {
    toast({
      title: "Achievement Unlocked!",
      description: `${achievement.title}: ${achievement.description}`,
    })
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#0ea5e9', '#eab308']
    })
  }

  const addXp = (amount: number) => {
    const newXp = xp + amount
    const nextLevelXp = getNextLevelXp(level)
    
    if (newXp >= nextLevelXp) {
      setXp(newXp - nextLevelXp)
      setLevel(prev => prev + 1)
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.5 },
        colors: ['#eab308', '#ffffff']
      })
      toast({
        title: "LEVEL UP!",
        description: `You are now Level ${level + 1}. Your ascent continues.`,
      })
    } else {
      setXp(newXp)
    }
  }

  const addGoal = (goalData: Omit<Goal, "id" | "progress" | "completed">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Math.random().toString(36).substring(2, 11),
      completed: false,
      progress: 0,
    }
    setGoals([...goals, newGoal])
    checkAchievements()
  }

  const updateGoal = (id: string, goalUpdate: Partial<Goal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...goalUpdate } : g))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
    setGoals(prev => prev.map(g => g.parentId === id ? { ...g, parentId: undefined } : g))
  }

  const toggleGoal = (id: string) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return

    const isCompleting = !goal.completed
    setGoals(goals.map(g => g.id === id ? { ...g, completed: isCompleting, progress: isCompleting ? 100 : g.progress } : g))
    
    if (isCompleting) {
      setMomentum(prev => Math.min(100, prev + 10))
      addXp(XP_PER_GOAL)
    }
    checkAchievements()
  }

  const addTask = (taskData: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 11),
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const isCompleting = !task.completed
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: isCompleting } : t)
    setTasks(updatedTasks)
    
    if (isCompleting) {
      setMomentum(prev => Math.min(100, prev + 2))
      setStreak(prev => prev + 1)
      addXp(XP_PER_TASK)
    }
    checkAchievements()
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const setIncome = (income: number) => {
    setFinance({
      monthlyIncome: income,
      allocations: {
        tithe: income * 0.10,
        savings: income * 0.30,
        charity: income * 0.05,
        investments: income * 0.20,
        dailyNeeds: income * 0.25,
      }
    })
  }

  const toggleMute = () => {
    setSettings(prev => ({ ...prev, mute: !prev.mute }))
  }

  return (
    <AscendContext.Provider value={{ 
      goals, tasks, finance, momentum, streak, xp, level, achievements, settings,
      addGoal, updateGoal, deleteGoal, toggleGoal, addTask, toggleTask, deleteTask, setIncome, toggleMute
    }}>
      {children}
    </AscendContext.Provider>
  )
}

export const useAscend = () => {
  const context = useContext(AscendContext)
  if (!context) throw new Error("useAscend must be used within AscendProvider")
  return context
}
