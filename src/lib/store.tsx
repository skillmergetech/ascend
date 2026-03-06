"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

export type GoalType = "weekly" | "monthly" | "quarterly" | "biannual" | "yearly"
export type PriorityType = "high" | "medium" | "low"

export interface UserProfile {
  name: string
  avatar: string
  joinDate: string
  onboardingCompleted: boolean
}

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

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  completed: boolean
  goalId?: string
  date: string
  priority: PriorityType
  description?: string
  timeEstimate?: string
  startTime?: string
  endTime?: string
  subtasks: SubTask[]
  timeOfDay?: "morning" | "evening" | "any"
}

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description: string
}

export interface FinanceData {
  monthlyIncome: number
  currency: string
  allocations: {
    tithe: number
    savings: number
    charity: number
    investments: number
    dailyNeeds: number
    misc: number
  }
  expenses: Expense[]
}

export interface Review {
  id: string
  date: string
  type: "weekly" | "monthly"
  stats: {
    tasksCompleted: number
    tasksTotal: number
    goalsCompleted: number
    xpEarned: number
    totalSpent: number
  }
  reflections: {
    wins: string
    obstacles: string
    improvements: string
  }
  intentions: string[]
}

interface AscendStore {
  user: UserProfile
  goals: Goal[]
  tasks: Task[]
  finance: FinanceData
  reviews: Review[]
  momentum: number
  streak: number
  xp: number
  level: number
  achievements: Achievement[]
  settings: {
    mute: boolean
    currency: string
    notifications: boolean
    reminderTime: string
  }
  updateUser: (user: Partial<UserProfile>) => void
  completeOnboarding: () => void
  addGoal: (goal: Omit<Goal, "id" | "progress" | "completed">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  toggleGoal: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed" | "subtasks" | "priority"> & { priority?: PriorityType, subtasks?: SubTask[] }) => void
  updateTask: (id: string, task: Partial<Task>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  setIncome: (income: number) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  addReview: (review: Omit<Review, "id" | "date">) => void
  updateSettings: (settings: Partial<AscendStore["settings"]>) => void
  toggleMute: () => void
  exportData: () => void
  resetData: () => void
}

const DEFAULT_FINANCE: FinanceData = {
  monthlyIncome: 0,
  currency: "USD",
  allocations: {
    tithe: 0,
    savings: 0,
    charity: 0,
    investments: 0,
    dailyNeeds: 0,
    misc: 0,
  },
  expenses: [],
}

const INITIAL_USER: UserProfile = {
  name: "New Achiever",
  avatar: "https://picsum.photos/seed/user/200/200",
  joinDate: new Date().toISOString().split('T')[0],
  onboardingCompleted: false
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
  const [user, setUser] = useState<UserProfile>(INITIAL_USER)
  const [goals, setGoals] = useState<Goal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [finance, setFinance] = useState<FinanceData>(DEFAULT_FINANCE)
  const [reviews, setReviews] = useState<Review[]>([])
  const [momentum, setMomentum] = useState(0)
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)
  const [settings, setSettings] = useState({ 
    mute: false, 
    currency: "USD", 
    notifications: true, 
    reminderTime: "08:00" 
  })
  const [hydrated, setHydrated] = useState(false)

  const XP_PER_TASK = 50
  const XP_PER_GOAL = 500
  const getNextLevelXp = (lvl: number) => lvl * 1000

  useEffect(() => {
    const stored = localStorage.getItem("ascend_data_v5")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser({ ...INITIAL_USER, ...parsed.user })
        setGoals(parsed.goals || [])
        setTasks((parsed.tasks || []).map((t: any) => ({
          ...t,
          priority: t.priority || "medium",
          subtasks: t.subtasks || [],
          timeOfDay: t.timeOfDay || "any"
        })))
        
        const loadedFinance = parsed.finance || DEFAULT_FINANCE
        setFinance({
          ...DEFAULT_FINANCE,
          ...loadedFinance,
          allocations: {
            ...DEFAULT_FINANCE.allocations,
            ...(loadedFinance.allocations || {})
          },
          expenses: loadedFinance.expenses || []
        })

        setReviews(parsed.reviews || [])
        setMomentum(parsed.momentum || 0)
        setStreak(parsed.streak || 0)
        setXp(parsed.xp || 0)
        setLevel(parsed.level || 1)
        setAchievements(parsed.achievements || INITIAL_ACHIEVEMENTS)
        setSettings({
          ...{ mute: false, currency: "USD", notifications: true, reminderTime: "08:00" },
          ...(parsed.settings || {})
        })
      } catch (e) {
        console.error("Failed to parse stored data", e)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("ascend_data_v5", JSON.stringify({ 
        user, goals, tasks, finance, reviews, momentum, streak, xp, level, achievements, settings 
      }))
    }
  }, [user, goals, tasks, finance, reviews, momentum, streak, xp, level, achievements, settings, hydrated])

  const updateUser = (update: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...update }))
  }

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingCompleted: true }))
    toast({ title: "Welcome, Commander", description: "Onboarding complete. Your ascent begins now." })
  }

  const updateSettings = (update: Partial<AscendStore["settings"]>) => {
    setSettings(prev => ({ ...prev, ...update }))
  }

  const resetData = () => {
    localStorage.removeItem("ascend_data_v5")
    window.location.reload()
  }

  const exportData = () => {
    const data = { user, goals, tasks, finance, reviews, momentum, streak, xp, level, achievements, settings }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ascend-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

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

  const checkAchievements = useCallback(() => {
    const newAchievements = [...achievements]
    let updated = false

    if (!newAchievements.find(a => a.id === "first_task")?.unlockedAt && tasks.some(t => t.completed)) {
      const idx = newAchievements.findIndex(a => a.id === "first_task")
      if (idx !== -1) {
        newAchievements[idx].unlockedAt = new Date().toISOString()
        updated = true
        triggerAchievementUI(newAchievements[idx])
      }
    }

    if (!newAchievements.find(a => a.id === "streak_7")?.unlockedAt && streak >= 7) {
      const idx = newAchievements.findIndex(a => a.id === "streak_7")
      if (idx !== -1) {
        newAchievements[idx].unlockedAt = new Date().toISOString()
        updated = true
        triggerAchievementUI(newAchievements[idx])
      }
    }

    const linkedGoalsCount = goals.filter(g => g.parentId).length
    if (!newAchievements.find(a => a.id === "cascade_5")?.unlockedAt && linkedGoalsCount >= 5) {
      const idx = newAchievements.findIndex(a => a.id === "cascade_5")
      if (idx !== -1) {
        newAchievements[idx].unlockedAt = new Date().toISOString()
        updated = true
        triggerAchievementUI(newAchievements[idx])
      }
    }

    if (updated) setAchievements(newAchievements)
  }, [achievements, tasks, streak, goals])

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
    setGoals(prev => [...prev, newGoal])
    setTimeout(checkAchievements, 0)
  }

  const updateGoal = (id: string, goalUpdate: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goalUpdate } : g))
  }

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id).map(g => g.parentId === id ? { ...g, parentId: undefined } : g))
  }

  const toggleGoal = (id: string) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return

    const isCompleting = !goal.completed
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: isCompleting, progress: isCompleting ? 100 : g.progress } : g))
    
    if (isCompleting) {
      setMomentum(prev => Math.min(100, prev + 10))
      addXp(XP_PER_GOAL)
    }
    setTimeout(checkAchievements, 0)
  }

  const addTask = (taskData: Omit<Task, "id" | "completed" | "subtasks" | "priority"> & { priority?: PriorityType, subtasks?: SubTask[] }) => {
    const newTask: Task = {
      ...taskData,
      priority: taskData.priority || "medium",
      subtasks: taskData.subtasks || [],
      id: Math.random().toString(36).substring(2, 11),
      completed: false,
    }
    setTasks(prev => [...prev, newTask])
  }

  const updateTask = (id: string, taskUpdate: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskUpdate } : t))
  }

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const isCompleting = !task.completed
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: isCompleting } : t))
    
    if (isCompleting) {
      setMomentum(prev => Math.min(100, prev + 2))
      setStreak(prev => prev + 1)
      addXp(XP_PER_TASK)
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.9, x: 0.9 },
        colors: ['#0ea5e9']
      })
    }
    setTimeout(checkAchievements, 0)
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const setIncome = (income: number) => {
    setFinance(prev => ({
      ...prev,
      monthlyIncome: income,
      allocations: {
        tithe: income * 0.10,
        savings: income * 0.30,
        charity: income * 0.05,
        investments: income * 0.20,
        dailyNeeds: income * 0.25,
        misc: income * 0.10,
      }
    }))
  }

  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substring(2, 11),
    }
    setFinance(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), newExpense]
    }))
  }

  const deleteExpense = (id: string) => {
    setFinance(prev => ({
      ...prev,
      expenses: (prev.expenses || []).filter(e => e.id !== id)
    }))
  }

  const addReview = (reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString()
    }
    setReviews(prev => [...prev, newReview])
    toast({ title: "Mission Review Sealed", description: "Operational records updated." })
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const toggleMute = () => {
    setSettings(prev => ({ ...prev, mute: !prev.mute }))
  }

  return (
    <AscendContext.Provider value={{ 
      user, goals, tasks, finance, reviews, momentum, streak, xp, level, achievements, settings,
      updateUser, completeOnboarding, addGoal, updateGoal, deleteGoal, toggleGoal, addTask, updateTask, toggleTask, deleteTask, setIncome, addExpense, deleteExpense, addReview,
      updateSettings, toggleMute, exportData, resetData
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
