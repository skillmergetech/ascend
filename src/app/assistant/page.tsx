"use client"

import { AppShell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAscend } from "@/lib/store"
import { Sparkles, Loader2, Target, CheckCircle2, ChevronRight, Zap } from "lucide-react"
import { useState } from "react"
import { defineGoal, GoalDefinitionAssistantOutput } from "@/ai/flows/goal-definition-assistant-flow"

export default function AssistantPage() {
  const [idea, setIdea] = useState("")
  const [context, setContext] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GoalDefinitionAssistantOutput | null>(null)
  const { addGoal } = useAscend()

  const handleRefine = async () => {
    if (!idea) return
    setLoading(true)
    try {
      const output = await defineGoal({ initialGoalIdea: idea, context, timeframe })
      setResult(output)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdopt = () => {
    if (!result) return
    addGoal({
      title: result.refinedGoal,
      type: "monthly" // Default to monthly for AI refined goals
    })
    setResult(null)
    setIdea("")
    setContext("")
    setTimeframe("")
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black font-headline text-foreground flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Vision Architect
          </h1>
          <p className="text-muted-foreground">Transform vague ideas into iron-clad SMART goals with AI.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <Card className="border-none shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Goal Architect</CardTitle>
                <CardDescription>Share your initial spark.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">The Big Idea</Label>
                  <Textarea 
                    placeholder="e.g. I want to start a side business or get healthier..." 
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="min-h-[100px] font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Additional Context</Label>
                  <Input 
                    placeholder="What resources do you have?" 
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Target Deadline</Label>
                  <Input 
                    placeholder="e.g. Next 6 months" 
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleRefine} 
                  disabled={loading || !idea} 
                  className="w-full bg-primary hover:bg-primary/90 py-6"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  {loading ? "Refining Vision..." : "Construct SMART Goal"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-7">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-primary border-2 shadow-2xl bg-primary/5">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-black text-primary">Your Refined Vision</CardTitle>
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold leading-relaxed mb-6">"{result.refinedGoal}"</p>
                    <Button onClick={handleAdopt} className="w-full bg-accent text-accent-foreground font-black hover:bg-accent/90">
                      Adopt This Goal
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(result.smartBreakdown).map(([key, value]) => (
                    <Card key={key} className="border-none shadow-md">
                      <CardContent className="p-4">
                        <h4 className="text-xs font-black uppercase text-primary mb-1">{key}</h4>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-none shadow-xl bg-foreground text-background">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Actionable First Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.actionableSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                        <span className="text-sm font-medium opacity-90">{step}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-primary/20 rounded-3xl">
                <Target className="h-16 w-16 text-primary/10 mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground">Your future starts here.</h3>
                <p className="text-muted-foreground max-w-sm">Enter your idea on the left to see the Vision Architect in action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
