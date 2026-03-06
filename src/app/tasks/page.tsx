
"use client"

import { AppShell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useAscend, Task, PriorityType, SubTask } from "@/lib/store"
import { 
  Plus, Trash2, CheckCircle2, Circle, Star, Trophy, Clock, 
  Sun, Moon, Filter, ListChecks, ArrowRight, LayoutGrid, 
  ChevronRight, Calendar, AlertCircle, Zap, TrendingUp
} from "lucide-react"
import { useState, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const { tasks, goals, addTask, toggleTask, deleteTask, updateTask } = useAscend()
  const { toast } = useToast()
  const [newTitle, setNewTitle] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<string>("none")
  const [viewMode, setViewMode] = useState<"morning" | "evening" | "all">("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const weeklyGoals = goals.filter(g => g.type === "weekly")
  const today = new Date().toISOString().split('T')[0]
  
  const filteredTasks = useMemo(() => {
    let list = tasks.filter(t => t.date === today)
    if (viewMode === "morning") return list.filter(t => t.timeOfDay === "morning")
    if (viewMode === "evening") return list.filter(t => t.timeOfDay === "evening")
    return list
  }, [tasks, today, viewMode])

  const completedCount = filteredTasks.filter(t => t.completed).length
  const totalCount = filteredTasks.length
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleAddTask = () => {
    if (!newTitle.trim()) return
    addTask({
      title: newTitle,
      date: today,
      goalId: selectedGoal === "none" ? undefined : selectedGoal,
      timeOfDay: viewMode === "all" ? "any" : viewMode
    })
    setNewTitle("")
    toast({
      title: "Task Logged",
      description: "Priority established for today's mission.",
    })
  }

  const handleToggle = (id: string) => {
    toggleTask(id)
  }

  const handleUpdateSubtask = (taskId: string, subId: string, completed: boolean) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const newSubtasks = task.subtasks.map(s => s.id === subId ? { ...s, completed } : s)
    updateTask(taskId, { subtasks: newSubtasks })
  }

  const handleAddSubtask = (taskId: string, title: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || !title) return
    const newSub: SubTask = { id: Math.random().toString(36).slice(2, 9), title, completed: false }
    updateTask(taskId, { subtasks: [...task.subtasks, newSub] })
  }

  const PriorityBadge = ({ priority }: { priority: PriorityType }) => {
    const styles = {
      high: "text-red-500 bg-red-500/10",
      medium: "text-orange-500 bg-orange-500/10",
      low: "text-blue-500 bg-blue-500/10"
    }
    return (
      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", styles[priority])}>
        {priority}
      </span>
    )
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black font-headline italic uppercase tracking-tighter flex items-center gap-3">
              Daily Execution
              <Zap className="h-8 w-8 text-primary fill-primary/20" />
            </h1>
            <p className="text-muted-foreground font-medium">Precision tactics for the 24-hour cycle.</p>
          </div>

          <div className="flex bg-muted/50 p-1 rounded-xl">
             <Button 
               variant={viewMode === "morning" ? "secondary" : "ghost"} 
               size="sm" 
               className="rounded-lg gap-2"
               onClick={() => setViewMode("morning")}
             >
               <Sun className="h-4 w-4" /> Morning
             </Button>
             <Button 
               variant={viewMode === "evening" ? "secondary" : "ghost"} 
               size="sm" 
               className="rounded-lg gap-2"
               onClick={() => setViewMode("evening")}
             >
               <Moon className="h-4 w-4" /> Evening
             </Button>
             <Button 
               variant={viewMode === "all" ? "secondary" : "ghost"} 
               size="sm" 
               className="rounded-lg gap-2"
               onClick={() => setViewMode("all")}
             >
               <LayoutGrid className="h-4 w-4" /> All Day
             </Button>
          </div>
        </header>

        {/* Productivity Insights */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-8 border-none bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={160} />
            </div>
            <CardContent className="p-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Execution Velocity</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black">{Math.round(completionRate)}%</span>
                    <span className="text-sm font-bold text-muted-foreground mb-2 uppercase">Completion</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black">{completedCount} / {totalCount}</p>
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Missions Accomplished</p>
                </div>
              </div>
              <div className="space-y-3">
                <Progress value={completionRate} className="h-3 ascend-gradient" />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Objective Initiation</span>
                  <span>Target Achievement</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4 border-none bg-primary/10 shadow-xl flex flex-col justify-center p-8">
             <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Tactical Focus</h4>
                  <p className="text-sm text-muted-foreground">Your {viewMode} cycle is currently {completionRate >= 100 ? "Complete" : "Active"}.</p>
                </div>
                <div className="pt-2">
                  <Button variant="link" className="p-0 h-auto text-accent font-black uppercase text-[10px] gap-1 hover:gap-2 transition-all">
                    View Productivity Trends <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
             </div>
          </Card>
        </div>

        {/* Quick Add Bar */}
        <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input 
                placeholder="Initialize new objective..." 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="pl-10 h-12 bg-muted/30 border-none font-bold placeholder:font-medium placeholder:text-muted-foreground"
              />
              <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger className="w-full sm:w-64 h-12 bg-muted/30 border-none">
                <SelectValue placeholder="Strategic Link" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">General Mission</SelectItem>
                {weeklyGoals.map(g => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask} className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-xl font-black uppercase text-xs">
              Deploy
            </Button>
          </CardContent>
        </Card>

        {/* Task List Toggles & Grouping */}
        <div className="space-y-6">
          <Tabs defaultValue="priority" className="w-full">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-black flex items-center gap-2">
                 <ListChecks className="h-5 w-5 text-accent" />
                 Missions Deployment
               </h2>
               <TabsList className="bg-muted/50 p-1">
                 <TabsTrigger value="priority" className="text-[10px] font-bold uppercase">Priority</TabsTrigger>
                 <TabsTrigger value="goal" className="text-[10px] font-bold uppercase">Goal Link</TabsTrigger>
                 <TabsTrigger value="time" className="text-[10px] font-bold uppercase">Timeline</TabsTrigger>
               </TabsList>
            </div>

            <TabsContent value="priority" className="space-y-8 mt-0">
               {(["high", "medium", "low"] as PriorityType[]).map(prio => {
                 const prioTasks = filteredTasks.filter(t => t.priority === prio)
                 if (prioTasks.length === 0 && viewMode !== "all") return null
                 return (
                   <div key={prio} className="space-y-3">
                     <div className="flex items-center gap-3 px-2">
                       <div className={cn("h-2 w-2 rounded-full", prio === "high" ? "bg-red-500" : prio === "medium" ? "bg-orange-500" : "bg-blue-500")} />
                       <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{prio} Priority</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {prioTasks.map(task => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                        {prioTasks.length === 0 && (
                          <p className="text-xs italic text-muted-foreground/50 px-4">No {prio} priority missions active.</p>
                        )}
                     </div>
                   </div>
                 )
               })}
            </TabsContent>

            <TabsContent value="goal" className="space-y-6">
              {/* Logic for goal grouping could go here */}
              <div className="grid grid-cols-1 gap-3">
                {filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Task Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-2xl border-none shadow-2xl max-w-2xl">
          {editingTask && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <PriorityBadge priority={editingTask.priority} />
                  <span className="text-xs font-bold text-muted-foreground uppercase">{editingTask.timeOfDay} focus</span>
                </div>
                <DialogTitle className="text-2xl font-black">{editingTask.title}</DialogTitle>
                <DialogDescription>Mission details and operational sub-steps.</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-6">
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Strategic Narrative</Label>
                    <Textarea 
                      placeholder="Operational details..." 
                      className="min-h-[120px]"
                      value={editingTask.description} 
                      onChange={(e) => updateTask(editingTask.id, { description: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-black uppercase text-muted-foreground">Sub-Objectives</Label>
                      <span className="text-[10px] font-bold text-accent">
                        {editingTask.subtasks.filter(s => s.completed).length}/{editingTask.subtasks.length} Completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {editingTask.subtasks.map(sub => (
                        <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                          <Checkbox 
                            checked={sub.completed} 
                            onCheckedChange={(v) => handleUpdateSubtask(editingTask.id, sub.id, !!v)} 
                          />
                          <span className={cn("text-sm font-medium", sub.completed && "line-through opacity-50")}>{sub.title}</span>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-4">
                        <Input 
                          placeholder="Add sub-task..." 
                          className="h-9 bg-muted/30 border-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddSubtask(editingTask.id, e.currentTarget.value)
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-6 border-l border-border/50 pl-6">
                   <div className="space-y-2">
                     <Label className="text-xs font-black uppercase text-muted-foreground">Strategic Link</Label>
                     <Select value={editingTask.goalId || "none"} onValueChange={(v) => updateTask(editingTask.id, { goalId: v === "none" ? undefined : v })}>
                       <SelectTrigger className="w-full bg-muted/30 border-none">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="none">Independent</SelectItem>
                         {weeklyGoals.map(g => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label className="text-xs font-black uppercase text-muted-foreground">Priority Tier</Label>
                     <Select value={editingTask.priority} onValueChange={(v) => updateTask(editingTask.id, { priority: v as PriorityType })}>
                       <SelectTrigger className="w-full bg-muted/30 border-none">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="high">High</SelectItem>
                         <SelectItem value="medium">Medium</SelectItem>
                         <SelectItem value="low">Low</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label className="text-xs font-black uppercase text-muted-foreground">Time Estimate</Label>
                     <div className="relative">
                       <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                       <Input 
                         value={editingTask.timeEstimate || ""} 
                         onChange={(e) => updateTask(editingTask.id, { timeEstimate: e.target.value })}
                         placeholder="e.g. 45m" 
                         className="pl-9 h-10 bg-muted/30 border-none" 
                       />
                     </div>
                   </div>

                   <div className="pt-4">
                     <Button 
                       variant="destructive" 
                       className="w-full gap-2 rounded-xl"
                       onClick={() => {
                         deleteTask(editingTask.id)
                         setIsDetailsOpen(false)
                       }}
                     >
                       <Trash2 className="h-4 w-4" /> Decommission Task
                     </Button>
                   </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)} className="w-full bg-primary font-black py-6 rounded-xl">Seal Operational File</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  )

  function TaskItem({ task }: { task: Task }) {
    return (
      <Card 
        className={cn(
          "border-none shadow-sm transition-all duration-300 group overflow-hidden relative",
          task.completed ? "bg-muted/30 opacity-60" : "bg-card/40 backdrop-blur-md hover:shadow-xl hover:-translate-y-0.5"
        )}
      >
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-colors",
          task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-orange-500" : "bg-blue-500"
        )} />
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => handleToggle(task.id)}
              className={cn(
                "h-10 w-10 rounded-full border-2 transition-all flex-shrink-0",
                task.completed ? "bg-accent border-accent text-white" : "border-muted-foreground/30 hover:border-primary"
              )}
            >
              {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <PriorityBadge priority={task.priority} />
                {task.timeEstimate && (
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {task.timeEstimate}
                  </span>
                )}
              </div>
              <p className={cn("font-bold text-foreground truncate", task.completed && "line-through decoration-primary opacity-50")}>
                {task.title}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                {task.goalId && (
                  <span className="text-[9px] font-black uppercase text-accent/80 flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5" /> {goals.find(g => g.id === task.goalId)?.title}
                  </span>
                )}
                {task.subtasks.length > 0 && (
                  <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                    <ListChecks className="h-2.5 w-2.5" /> {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} sub-tasks
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-10 w-10 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
               onClick={() => {
                 setEditingTask(task)
                 setIsDetailsOpen(true)
               }}
             >
               <Plus className="h-5 w-5 rotate-45" />
             </Button>
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-10 w-10 text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity"
               onClick={() => {
                 setEditingTask(task)
                 setIsDetailsOpen(true)
               }}
             >
               <ArrowRight className="h-5 w-5" />
             </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
}
