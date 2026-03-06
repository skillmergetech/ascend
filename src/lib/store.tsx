"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type GoalType = "weekly" | "monthly" | "quarterly" | "biannual" | "yearly"

export interface Goal {
  id: string
  title: string
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
  addGoal: (goal: Omit<Goal, "id" | "progress" | "completed">) => void
  toggleGoal: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed">) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  setIncome: (income: number) => void
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

const AscendContext = createContext<AscendStore | undefined>(undefined)

export function AscendProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [finance, setFinance] = useState<FinanceData>(DEFAULT_FINANCE)
  const [momentum, setMomentum] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("ascend_data")
    if (stored) {
      const parsed = JSON.parse(stored)
      setGoals(parsed.goals || [])
      setTasks(parsed.tasks || [])
      setFinance(parsed.finance || DEFAULT_FINANCE)
      setMomentum(parsed.momentum || 0)
      setStreak(parsed.streak || 0)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("ascend_data", JSON.stringify({ goals, tasks, finance, momentum, streak }))
    }
  }, [goals, tasks, finance, momentum, streak, hydrated])

  const addGoal = (goalData: Omit<Goal, "id" | "progress" | "completed">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Math.random().toString(36).substring(2, 11),
      completed: false,
      progress: 0,
    }
    setGoals([...goals, newGoal])
  }

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g))
    if (!goals.find(g => g.id === id)?.completed) {
      setMomentum(prev => Math.min(100, prev + 10))
    }
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
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    setTasks(updatedTasks)
    
    const task = tasks.find(t => t.id === id)
    if (task && !task.completed) {
      setMomentum(prev => Math.min(100, prev + 2))
      setStreak(prev => prev + 1)
    }
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

  return (
    <AscendContext.Provider value={{ 
      goals, tasks, finance, momentum, streak, 
      addGoal, toggleGoal, addTask, toggleTask, deleteTask, setIncome 
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
