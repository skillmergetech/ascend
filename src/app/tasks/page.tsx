"use client"

import { AppShell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAscend } from "@/lib/store"
import { Plus, Trash2, CheckCircle2, Circle, Star, Trophy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const { tasks, goals, addTask, toggleTask, deleteTask } = useAscend()
  const { toast } = useToast()
  const [newTitle, setNewTitle] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<string>("none")

  const weeklyGoals = goals.filter(g => g.type === "weekly")
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.date === today)

  const handleAddTask = () => {
    if (!newTitle.trim()) return
    addTask({
      title: newTitle,
      date: today,
      goalId: selectedGoal === "none" ? undefined : selectedGoal
    })
    setNewTitle("")
    toast({
      title: "Task Added",
      description: "Stay focused on the mission.",
    })
  }

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id)
    toggleTask(id)
    if (task && !task.completed) {
      toast({
        title: "Achievement Unlocked!",
        description: "Task completed. Momentum increased!",
        action: <Trophy className="h-5 w-5 text-accent" />,
      })
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black font-headline">Daily Execution</h1>
          <p className="text-muted-foreground">Small daily actions lead to massive yearly transformations.</p>
        </header>

        <Card className="border-none shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">New Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="What must be done today?" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1 font-medium"
              />
              <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                <SelectTrigger className="w-full sm:w-48 text-muted-foreground">
                  <SelectValue placeholder="Link to Weekly Goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General Task</SelectItem>
                  {weeklyGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddTask} className="bg-primary hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2">
            <Star className="h-5 w-5 text-accent fill-accent" />
            Today's Missions
          </h2>
          
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="text-center py-20 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
                <CheckCircle2 className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Your schedule is clear. Plan your next victory.</p>
              </div>
            ) : (
              todayTasks.map((task) => (
                <Card key={task.id} className={`border-none shadow-sm transition-all duration-300 ${task.completed ? 'opacity-60 bg-muted/50' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        onClick={() => handleToggle(task.id)}
                        className="cursor-pointer transition-transform active:scale-90"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-foreground ${task.completed ? 'line-through decoration-primary' : ''}`}>
                          {task.title}
                        </p>
                        {task.goalId && (
                          <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full inline-block mt-1">
                            {goals.find(g => g.id === task.goalId)?.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
