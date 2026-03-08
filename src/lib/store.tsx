
"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase"
import { doc, collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { 
  setDocumentNonBlocking, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from "@/firebase/non-blocking-updates"

export type GoalType = "weekly" | "monthly" | "quarterly" | "biannual" | "yearly"
export type PriorityType = "high" | "medium" | "low"

export interface UserProfile {
  name: string
  avatar: string
  joinDate: string
  onboardingCompleted: boolean
  momentumScore?: number
  achievementStreak?: number
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
  userId: string
  title: string
  description?: string
  targetDate?: string
  outcome?: string
  icon?: string
  type: GoalType
  completed: boolean
  parentId?: string
  progress: number
  createdAt: string
  updatedAt: string
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  userId: string
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
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description: string
}

export interface FinanceData {
  id: string
  userId: string
  monthlyIncomes: Record<number, number>
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
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  userId: string
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
  createdAt: string
  updatedAt: string
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
  addGoal: (goal: Omit<Goal, "id" | "progress" | "completed" | "userId" | "createdAt" | "updatedAt">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  toggleGoal: (id: string) => void
  addTask: (task: Omit<Task, "id" | "completed" | "subtasks" | "priority" | "userId" | "createdAt" | "updatedAt"> & { priority?: PriorityType, subtasks?: SubTask[] }) => void
  updateTask: (id: string, task: Partial<Task>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  setIncome: (income: number, month?: number) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  addReview: (review: Omit<Review, "id" | "date" | "userId" | "createdAt" | "updatedAt">) => void
  updateSettings: (settings: Partial<AscendStore["settings"]>) => void
  toggleMute: () => void
  exportData: () => void
  resetData: () => void
}

const DEFAULT_FINANCE: FinanceData = {
  id: "current",
  userId: "",
  monthlyIncomes: {},
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
  const { user: fbUser, isUserLoading: isAuthLoading } = useUser()
  const db = useFirestore()

  // Local State
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

  // Firestore Sync Queries
  const goalsQuery = useMemoFirebase(() => {
    if (!db || !fbUser) return null;
    return collection(db, "users", fbUser.uid, "goals");
  }, [db, fbUser]);

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !fbUser) return null;
    return query(collection(db, "users", fbUser.uid, "tasks"), orderBy("createdAt", "desc"));
  }, [db, fbUser]);

  const financeDocRef = useMemoFirebase(() => {
    if (!db || !fbUser) return null;
    return doc(db, "users", fbUser.uid, "financialConfiguration", "current");
  }, [db, fbUser]);

  const profileDocRef = useMemoFirebase(() => {
    if (!db || !fbUser) return null;
    return doc(db, "users", fbUser.uid);
  }, [db, fbUser]);

  const reviewsQuery = useMemoFirebase(() => {
    if (!db || !fbUser) return null;
    return collection(db, "users", fbUser.uid, "reviews");
  }, [db, fbUser]);

  // Firestore Hooks (Read)
  const { data: fbGoals } = useCollection<Goal>(goalsQuery as any);
  const { data: fbTasks } = useCollection<Task>(tasksQuery as any);
  const { data: fbFinance } = useDoc<FinanceData>(financeDocRef as any);
  const { data: fbProfile } = useDoc<UserProfile>(profileDocRef as any);
  const { data: fbReviews } = useCollection<Review>(reviewsQuery as any);

  // Sync Firestore to State
  useEffect(() => {
    if (fbGoals) setGoals(fbGoals);
  }, [fbGoals]);

  useEffect(() => {
    if (fbTasks) setTasks(fbTasks);
  }, [fbTasks]);

  useEffect(() => {
    if (fbFinance) setFinance(fbFinance);
  }, [fbFinance]);

  useEffect(() => {
    if (fbProfile) {
      setUser(prev => ({ ...prev, ...fbProfile }));
      if (fbProfile.momentumScore !== undefined) setMomentum(fbProfile.momentumScore);
      if (fbProfile.achievementStreak !== undefined) setStreak(fbProfile.achievementStreak);
    }
  }, [fbProfile]);

  useEffect(() => {
    if (fbReviews) setReviews(fbReviews);
  }, [fbReviews]);

  // Local Storage Hydration (as fallback/initial)
  useEffect(() => {
    const stored = localStorage.getItem("ascend_data_v8")
    if (stored && !fbUser) {
      try {
        const parsed = JSON.parse(stored)
        setUser({ ...INITIAL_USER, ...parsed.user })
        setGoals(parsed.goals || [])
        setTasks(parsed.tasks || [])
        setFinance(parsed.finance || DEFAULT_FINANCE)
        setReviews(parsed.reviews || [])
        setMomentum(parsed.momentum || 0)
        setStreak(parsed.streak || 0)
        setXp(parsed.xp || 0)
        setLevel(parsed.level || 1)
        setAchievements(parsed.achievements || INITIAL_ACHIEVEMENTS)
        setSettings(parsed.settings || { mute: false, currency: "USD", notifications: true, reminderTime: "08:00" })
      } catch (e) { console.error(e); }
    }
    setHydrated(true)
  }, [fbUser])

  useEffect(() => {
    if (hydrated && !fbUser) {
      localStorage.setItem("ascend_data_v8", JSON.stringify({ 
        user, goals, tasks, finance, reviews, momentum, streak, xp, level, achievements, settings 
      }))
    }
  }, [user, goals, tasks, finance, reviews, momentum, streak, xp, level, achievements, settings, hydrated, fbUser])

  const XP_PER_TASK = 50
  const XP_PER_GOAL = 500
  const getNextLevelXp = (lvl: number) => lvl * 1000

  const updateUser = (update: Partial<UserProfile>) => {
    const newUser = { ...user, ...update };
    setUser(newUser);
    if (fbUser && profileDocRef) {
      setDocumentNonBlocking(profileDocRef, { ...newUser, id: fbUser.uid, userId: fbUser.uid, updatedAt: new Date().toISOString() }, { merge: true });
    }
  }

  const completeOnboarding = () => {
    updateUser({ onboardingCompleted: true });
    toast({ title: "Welcome, Commander", description: "Onboarding complete. Your ascent begins now." })
  }

  const updateSettings = (update: Partial<AscendStore["settings"]>) => {
    setSettings(prev => ({ ...prev, ...update }))
  }

  const resetData = () => {
    localStorage.removeItem("ascend_data_v8")
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
    toast({ title: "Achievement Unlocked!", description: `${achievement.title}: ${achievement.description}` })
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#8b5cf6', '#0ea5e9', '#eab308'] })
  }

  const checkAchievements = useCallback(() => {
    const newAchievements = [...achievements]
    let updated = false
    if (!newAchievements.find(a => a.id === "first_task")?.unlockedAt && tasks.some(t => t.completed)) {
      const idx = newAchievements.findIndex(a => a.id === "first_task")
      if (idx !== -1) { newAchievements[idx].unlockedAt = new Date().toISOString(); updated = true; triggerAchievementUI(newAchievements[idx]); }
    }
    if (updated) setAchievements(newAchievements)
  }, [achievements, tasks])

  const addXp = (amount: number) => {
    const newXp = xp + amount
    const nextLevelXp = getNextLevelXp(level)
    if (newXp >= nextLevelXp) {
      setXp(newXp - nextLevelXp)
      setLevel(prev => prev + 1)
      confetti({ particleCount: 200, spread: 160, origin: { y: 0.5 }, colors: ['#eab308', '#ffffff'] })
      toast({ title: "LEVEL UP!", description: `You are now Level ${level + 1}. Your ascent continues.` })
    } else { setXp(newXp) }
  }

  const addGoal = (goalData: Omit<Goal, "id" | "progress" | "completed" | "userId" | "createdAt" | "updatedAt">) => {
    const id = Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();
    const newGoal: Goal = {
      ...goalData,
      id,
      userId: fbUser?.uid || "local",
      completed: false,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    }
    if (fbUser && db) {
      const gRef = doc(db, "users", fbUser.uid, "goals", id);
      setDocumentNonBlocking(gRef, newGoal, { merge: true });
    } else {
      setGoals(prev => [...prev, newGoal]);
    }
    setTimeout(checkAchievements, 0)
  }

  const updateGoal = (id: string, goalUpdate: Partial<Goal>) => {
    if (fbUser && db) {
      const gRef = doc(db, "users", fbUser.uid, "goals", id);
      updateDocumentNonBlocking(gRef, { ...goalUpdate, updatedAt: new Date().toISOString() });
    } else {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goalUpdate } : g));
    }
  }

  const deleteGoal = (id: string) => {
    if (fbUser && db) {
      const gRef = doc(db, "users", fbUser.uid, "goals", id);
      deleteDocumentNonBlocking(gRef);
    } else {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  }

  const toggleGoal = (id: string) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return
    const isCompleting = !goal.completed
    updateGoal(id, { completed: isCompleting, progress: isCompleting ? 100 : goal.progress });
    if (isCompleting) {
      setMomentum(prev => Math.min(100, prev + 10))
      addXp(XP_PER_GOAL)
    }
    setTimeout(checkAchievements, 0)
  }

  const addTask = (taskData: Omit<Task, "id" | "completed" | "subtasks" | "priority" | "userId" | "createdAt" | "updatedAt"> & { priority?: PriorityType, subtasks?: SubTask[] }) => {
    const id = Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      priority: taskData.priority || "medium",
      subtasks: taskData.subtasks || [],
      id,
      userId: fbUser?.uid || "local",
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    if (fbUser && db) {
      const tRef = doc(db, "users", fbUser.uid, "tasks", id);
      setDocumentNonBlocking(tRef, newTask, { merge: true });
    } else {
      setTasks(prev => [...prev, newTask]);
    }
  }

  const updateTask = (id: string, taskUpdate: Partial<Task>) => {
    if (fbUser && db) {
      const tRef = doc(db, "users", fbUser.uid, "tasks", id);
      updateDocumentNonBlocking(tRef, { ...taskUpdate, updatedAt: new Date().toISOString() });
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskUpdate } : t));
    }
  }

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const isCompleting = !task.completed
    updateTask(id, { completed: isCompleting });
    if (isCompleting) {
      setMomentum(prev => Math.min(100, prev + 2))
      setStreak(prev => prev + 1)
      addXp(XP_PER_TASK)
      confetti({ particleCount: 50, spread: 30, origin: { y: 0.9, x: 0.9 }, colors: ['#0ea5e9'] })
    }
    setTimeout(checkAchievements, 0)
  }

  const deleteTask = (id: string) => {
    if (fbUser && db) {
      const tRef = doc(db, "users", fbUser.uid, "tasks", id);
      deleteDocumentNonBlocking(tRef);
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }

  const setIncome = (income: number, month?: number) => {
    const newIncomes = { ...finance.monthlyIncomes };
    if (month !== undefined) { newIncomes[month] = income; }
    const update = {
      monthlyIncomes: newIncomes,
      monthlyIncome: income,
      allocations: {
        tithe: income * 0.10,
        savings: income * 0.30,
        charity: income * 0.05,
        investments: income * 0.20,
        dailyNeeds: income * 0.25,
        misc: income * 0.10,
      },
      updatedAt: new Date().toISOString()
    };
    if (fbUser && financeDocRef) {
      setDocumentNonBlocking(financeDocRef, { ...finance, ...update, id: "current", userId: fbUser.uid }, { merge: true });
    } else {
      setFinance(prev => ({ ...prev, ...update }));
    }
  }

  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newExpense: Expense = { ...expenseData, id };
    const newExpenses = [...(finance.expenses || []), newExpense];
    if (fbUser && financeDocRef) {
      updateDocumentNonBlocking(financeDocRef, { expenses: newExpenses, updatedAt: new Date().toISOString() });
    } else {
      setFinance(prev => ({ ...prev, expenses: newExpenses }));
    }
  }

  const deleteExpense = (id: string) => {
    const newExpenses = (finance.expenses || []).filter(e => e.id !== id);
    if (fbUser && financeDocRef) {
      updateDocumentNonBlocking(financeDocRef, { expenses: newExpenses, updatedAt: new Date().toISOString() });
    } else {
      setFinance(prev => ({ ...prev, expenses: newExpenses }));
    }
  }

  const addReview = (reviewData: Omit<Review, "id" | "date" | "userId" | "createdAt" | "updatedAt">) => {
    const id = Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();
    const newReview: Review = {
      ...reviewData,
      id,
      userId: fbUser?.uid || "local",
      date: now,
      createdAt: now,
      updatedAt: now,
    }
    if (fbUser && db) {
      const rRef = doc(db, "users", fbUser.uid, "reviews", id);
      setDocumentNonBlocking(rRef, newReview, { merge: true });
    } else {
      setReviews(prev => [...prev, newReview]);
    }
    toast({ title: "Mission Review Sealed", description: "Operational records updated." })
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  }

  const toggleMute = () => {
    setSettings(prev => ({ ...prev, mute: !prev.mute }))
  }

  if (!hydrated || isAuthLoading) return null;

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
