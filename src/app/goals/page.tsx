"use client"

import { AppShell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAscend, GoalType, Goal } from "@/lib/store"
import { Target, ChevronRight, Layers, Trophy, CheckCircle2, Circle, Plus, Settings, Trash2, Edit, Calendar, Flag, BarChart, Sparkles } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoal } = useAscend()
  const { toast } = useToast()
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Goal Creation State
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newType, setNewType] = useState<GoalType>("weekly")
  const [newParent, setNewParent] = useState<string>("none")
  const [newOutcome, setNewOutcome] = useState("")
  const [newDate, setNewDate] = useState("")

  const goalTypes: GoalType[] = ["weekly", "monthly", "quarterly", "biannual", "yearly"]

  const getSubGoalsCount = (parentId: string) => goals.filter(g => g.parentId === parentId).length

  const handleCreate = () => {
    if (!newTitle.trim()) return
    addGoal({
      title: newTitle,
      description: newDesc,
      type: newType,
      parentId: newParent === "none" ? undefined : newParent,
      outcome: newOutcome,
      targetDate: newDate,
    })
    resetCreateForm()
    setIsCreateOpen(false)
    toast({ title: "Target Set", description: "The hierarchy has been updated." })
  }

  const resetCreateForm = () => {
    setNewTitle("")
    setNewDesc("")
    setNewType("weekly")
    setNewParent("none")
    setNewOutcome("")
    setNewDate("")
  }

  const getPotentialParents = (type: GoalType) => {
    const hierarchyOrder: GoalType[] = ["weekly", "monthly", "quarterly", "biannual", "yearly"]
    const currentIndex = hierarchyOrder.indexOf(type)
    if (currentIndex === hierarchyOrder.length - 1) return []
    const parentType = hierarchyOrder[currentIndex + 1]
    return goals.filter(g => g.type === parentType)
  }

  const GoalCard = ({ goal }: { goal: Goal }) => (
    <div className="relative group">
      <Card className={cn(
        "border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:scale-[1.02]",
        goal.completed && "opacity-60 grayscale-[0.5]"
      )}>
        <div className="h-1 ascend-gradient w-full opacity-30" />
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Target className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase text-primary tracking-tighter bg-primary/10 px-2 py-0.5 rounded-full">
                {goal.type}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditingGoal(goal)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteGoal(goal.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <h4 className={cn("text-base font-bold leading-tight mb-2", goal.completed && "line-through")}>{goal.title}</h4>
          
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <BarChart className="h-3 w-3" /> Progress
              </span>
              <span className="text-[10px] font-black text-primary">{Math.round(goal.progress)}%</span>
            </div>
            <Progress value={goal.progress} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Layers className="h-3 w-3" />
                {getSubGoalsCount(goal.id)} sub-goals
              </div>
              {goal.targetDate && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {goal.targetDate}
                </div>
              )}
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => toggleGoal(goal.id)}
              className={cn("h-8 w-8 rounded-full border-2 transition-all", goal.completed ? "bg-accent border-accent text-white" : "border-muted-foreground/30 hover:border-primary")}
            >
              {goal.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Connector line for hierarchical visual (optional) */}
      {goal.parentId && (
        <div className="absolute -left-4 top-1/2 w-4 h-px bg-primary/20 -z-10" />
      )}
    </div>
  )

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Layers className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-black font-headline tracking-tighter uppercase italic">Goal Cascade</h1>
            </div>
            <p className="text-muted-foreground font-medium">Strategically align every micro-action with your macro-vision.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 py-6 px-8 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs">
                <Plus className="h-5 w-5 mr-2" />
                Initialize New Target
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur-2xl border-none shadow-2xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Define Strategic Objective
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Title</Label>
                    <Input placeholder="e.g. Master React Concurrency" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Description</Label>
                    <Textarea placeholder="Vision details..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Measurable Outcome</Label>
                    <Input placeholder="What defines success?" value={newOutcome} onChange={e => setNewOutcome(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Cascade Level</Label>
                    <Select value={newType} onValueChange={v => setNewType(v as GoalType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {goalTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Target Completion Date</Label>
                    <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Parent Cascade</Label>
                    <Select value={newParent} onValueChange={setNewParent}>
                      <SelectTrigger><SelectValue placeholder="Select Parent" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Independent Goal</SelectItem>
                        {getPotentialParents(newType).map(g => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} className="w-full bg-primary font-black py-6">Deploy Objective</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        {/* Visual Cascade Hierarchy */}
        <Accordion type="multiple" defaultValue={["yearly", "biannual", "quarterly", "monthly", "weekly"]} className="space-y-6">
          {goalTypes.reverse().map((type) => (
            <AccordionItem key={type} value={type} className="border-none">
              <AccordionTrigger className="hover:no-underline py-0">
                <div className="flex items-center gap-4 w-full text-left">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <span className="text-xs font-black text-primary">{type.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black uppercase tracking-wider text-foreground/90">{type} Targets</h3>
                    <div className="h-0.5 w-full bg-muted mt-2 rounded-full overflow-hidden">
                      <div className="h-full ascend-gradient opacity-30" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-14">
                  {goals.filter(g => g.type === type).map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                  {goals.filter(g => g.type === type).length === 0 && (
                    <div className="col-span-full py-8 text-center border-2 border-dashed border-muted rounded-3xl opacity-40">
                      <p className="text-sm font-bold">No active {type} objectives defined.</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Edit Modal */}
        <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
          <DialogContent className="bg-card/95 backdrop-blur-2xl border-none shadow-2xl max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Adjust Trajectory</DialogTitle>
            </DialogHeader>
            {editingGoal && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground">Current Progress</Label>
                  <div className="flex items-center gap-6">
                    <Slider 
                      value={[editingGoal.progress]} 
                      onValueChange={([val]) => updateGoal(editingGoal.id, { progress: val, completed: val === 100 })} 
                      max={100} 
                      step={1} 
                      className="flex-1"
                    />
                    <span className="font-black text-primary text-xl min-w-[3rem]">{editingGoal.progress}%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Title</Label>
                    <Input value={editingGoal.title} onChange={e => updateGoal(editingGoal.id, { title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Measurable Outcome</Label>
                    <Input value={editingGoal.outcome || ""} onChange={e => updateGoal(editingGoal.id, { outcome: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Target Date</Label>
                    <Input type="date" value={editingGoal.targetDate || ""} onChange={e => updateGoal(editingGoal.id, { targetDate: e.target.value })} />
                  </div>
                </div>
                <Button onClick={() => setEditingGoal(null)} className="w-full bg-accent text-accent-foreground font-black py-6">Lock Changes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
