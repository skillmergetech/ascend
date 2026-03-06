"use client"

import { AppShell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAscend, GoalType } from "@/lib/store"
import { Target, ChevronRight, Layers, Trophy, CheckCircle2, Circle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function GoalsPage() {
  const { goals, addGoal, toggleGoal } = useAscend()
  const { toast } = useToast()
  const [newTitle, setNewTitle] = useState("")
  const [selectedType, setSelectedType] = useState<GoalType>("weekly")
  const [selectedParent, setSelectedParent] = useState<string>("none")

  const types: GoalType[] = ["weekly", "monthly", "quarterly", "biannual", "yearly"]

  const handleAddGoal = () => {
    if (!newTitle.trim()) return
    addGoal({
      title: newTitle,
      type: selectedType,
      parentId: selectedParent === "none" ? undefined : selectedParent
    })
    setNewTitle("")
    toast({
      title: "Goal Established",
      description: "One step closer to your vision.",
    })
  }

  // Helper to get parents for linking (e.g., Weekly can link to Monthly)
  const getPotentialParents = (type: GoalType) => {
    const hierarchyOrder: GoalType[] = ["weekly", "monthly", "quarterly", "biannual", "yearly"]
    const currentIndex = hierarchyOrder.indexOf(type)
    if (currentIndex === hierarchyOrder.length - 1) return []
    const parentType = hierarchyOrder[currentIndex + 1]
    return goals.filter(g => g.type === parentType)
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black font-headline">Target Hierarchy</h1>
            <p className="text-muted-foreground">Align your small wins with your big aspirations.</p>
          </div>
          <div className="hidden md:block">
            <Layers className="h-12 w-12 text-primary opacity-20" />
          </div>
        </header>

        <Card className="border-none shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Declare a Target</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Goal Statement</Label>
              <Input 
                placeholder="What do you want to achieve?" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="font-semibold"
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Timeframe</Label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as GoalType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Cascade From</Label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Parent Goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Link</SelectItem>
                  {getPotentialParents(selectedType).map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button onClick={handleAddGoal} size="icon" className="h-10 w-full bg-primary hover:bg-primary/90">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-primary/5">
            <TabsTrigger value="all">All</TabsTrigger>
            {types.map(t => (
              <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-6">
            {["all", ...types].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(tabValue === "all" ? goals : goals.filter(g => g.type === tabValue)).map(goal => (
                    <Card key={goal.id} className={`border-none shadow-md overflow-hidden transition-all duration-300 ${goal.completed ? 'bg-primary/5' : 'hover:scale-[1.02]'}`}>
                      <div className="h-1 bg-primary/10">
                        {goal.completed && <div className="h-full bg-accent w-full" />}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {goal.type}
                          </span>
                          <button onClick={() => toggleGoal(goal.id)}>
                            {goal.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                            )}
                          </button>
                        </div>
                        <CardTitle className={`text-base font-bold leading-tight ${goal.completed ? 'text-muted-foreground line-through' : ''}`}>
                          {goal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {goal.parentId && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Layers className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] font-medium text-muted-foreground truncate">
                              Linked to: {goals.find(p => p.id === goal.parentId)?.title}
                            </span>
                          </div>
                        )}
                        {goal.completed && (
                          <div className="mt-4 flex items-center gap-2 text-accent text-xs font-bold">
                            <Trophy className="h-3 w-3" />
                            Goal Reached!
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {(tabValue === "all" ? goals : goals.filter(g => g.type === tabValue)).length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-white rounded-3xl border border-dashed border-border">
                      <p>No goals set for this category.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </AppShell>
  )
}
