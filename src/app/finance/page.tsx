"use client"

import { AppShell } from "@/components/layout/Shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAscend, Expense } from "@/lib/store"
import { Wallet, PieChart as PieChartIcon, Landmark, Heart, PiggyBank, Briefcase, Plus, Trash2, ArrowUpRight, TrendingUp, AlertTriangle, Coins } from "lucide-react"
import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function FinancePage() {
  const { finance, setIncome, addExpense, deleteExpense } = useAscend()
  const { toast } = useToast()
  
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseDesc, setExpenseDesc] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("Daily Needs")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

  const categories = [
    { label: "Savings", icon: PiggyBank, percent: 30, color: "#3b82f6", bg: "bg-blue-500/10", value: finance.allocations.savings },
    { label: "Daily Needs", icon: Briefcase, percent: 25, color: "#22c55e", bg: "bg-green-500/10", value: finance.allocations.dailyNeeds },
    { label: "Investments", icon: Landmark, percent: 20, color: "#a855f7", bg: "bg-purple-500/10", value: finance.allocations.investments },
    { label: "Tithe", icon: Heart, percent: 10, color: "#f97316", bg: "bg-orange-500/10", value: finance.allocations.tithe },
    { label: "Misc", icon: Coins, percent: 10, color: "#64748b", bg: "bg-slate-500/10", value: finance.allocations.misc },
    { label: "Charity", icon: Heart, percent: 5, color: "#ec4899", bg: "bg-pink-500/10", value: finance.allocations.charity },
  ]

  const chartData = categories.map(cat => ({
    name: cat.label,
    value: cat.value,
    color: cat.color
  }))

  const getExpensesByCategory = (category: string) => {
    return finance.expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
  }

  const handleAddExpense = () => {
    if (!expenseAmount || !expenseDesc) return
    addExpense({
      amount: Number(expenseAmount),
      description: expenseDesc,
      category: expenseCategory,
      date: new Date().toISOString().split('T')[0]
    })
    setExpenseAmount("")
    setExpenseDesc("")
    setIsAddExpenseOpen(false)
    toast({ title: "Expense Logged", description: "Your budget has been updated." })
  }

  const savingsProjection = useMemo(() => {
    const monthlyRate = finance.allocations.savings + finance.allocations.investments
    return {
      oneYear: monthlyRate * 12,
      fiveYears: monthlyRate * 60,
      tenYears: monthlyRate * 120
    }
  }, [finance.allocations])

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black font-headline text-foreground italic uppercase tracking-tighter">Financial Fortress</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Strategic wealth management through the 90/10 principle.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="w-full md:w-64 border-primary shadow-xl shadow-primary/10 bg-card/50 backdrop-blur-md">
              <CardContent className="p-4 space-y-2">
                <Label htmlFor="income" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Monthly Fuel (Income)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-lg">$</span>
                  <Input 
                    id="income" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-8 font-black text-xl border-none bg-primary/10 focus-visible:ring-primary rounded-xl h-12"
                    value={finance.monthlyIncome || ""}
                    onChange={(e) => setIncome(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="h-20 w-20 rounded-3xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 flex flex-col items-center justify-center gap-1">
                  <Plus className="h-6 w-6" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Log</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-2xl border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Record Outflow</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Amount</Label>
                    <Input type="number" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Description</Label>
                    <Input placeholder="What did you spend on?" value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Category</Label>
                    <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.label} value={cat.label}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddExpense} className="w-full bg-primary font-black py-6">Authorize Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Allocation Analysis */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Real-Time Allocation
                </CardTitle>
                <CardDescription>Visual breakdown of your strategic deployment.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const spent = getExpensesByCategory(cat.label)
                const limit = cat.value
                const progress = limit > 0 ? (spent / limit) * 100 : 0
                const isNearingLimit = progress > 80 && progress < 100
                const isOverLimit = progress >= 100

                return (
                  <Card key={cat.label} className="border-none shadow-lg bg-card/40 backdrop-blur-md relative overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", cat.bg)}>
                          <cat.icon className="h-6 w-6" style={{ color: cat.color }} />
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{cat.label}</span>
                          <p className="text-xl font-black text-foreground">${limit.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-end text-[10px] font-bold">
                          <span className="text-muted-foreground uppercase">Utilized</span>
                          <span className={cn(
                            isOverLimit ? "text-destructive" : isNearingLimit ? "text-orange-500" : "text-primary"
                          )}>
                            ${spent.toLocaleString()} ({Math.round(progress)}%)
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(progress, 100)} 
                          className={cn("h-1.5", isOverLimit ? "[&>div]:bg-destructive" : isNearingLimit ? "[&>div]:bg-orange-500" : "")} 
                        />
                      </div>

                      {(isNearingLimit || isOverLimit) && (
                        <div className={cn(
                          "mt-4 p-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase animate-pulse",
                          isOverLimit ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-500"
                        )}>
                          <AlertTriangle className="h-3 w-3" />
                          {isOverLimit ? "Breach: Deployment Exceeded" : "Warning: Approaching Limit"}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Right Column: Projections & History */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="border-none shadow-2xl ascend-gradient text-white relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 opacity-10">
                 <TrendingUp size={240} />
               </div>
               <CardHeader>
                 <CardTitle className="text-2xl font-black italic uppercase">Wealth Trajectory</CardTitle>
                 <CardDescription className="text-white/70">Savings & Investment compound projection.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6 pt-4">
                 <div className="grid grid-cols-1 gap-4">
                   {[
                     { label: "1 Year Forecast", value: savingsProjection.oneYear, delay: "0.1s" },
                     { label: "5 Year Forecast", value: savingsProjection.fiveYears, delay: "0.2s" },
                     { label: "10 Year Forecast", value: savingsProjection.tenYears, delay: "0.3s" }
                   ].map((proj, idx) => (
                     <div key={idx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 animate-rise" style={{ animationDelay: proj.delay }}>
                       <p className="text-[10px] font-black uppercase text-white/70 mb-1">{proj.label}</p>
                       <h3 className="text-3xl font-black">${proj.value.toLocaleString()}</h3>
                       <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-white/50">
                         <ArrowUpRight className="h-3 w-3" />
                         Based on current ${((finance.allocations.savings + finance.allocations.investments)).toLocaleString()}/mo rate
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
            </Card>

            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Execution History</CardTitle>
                  <CardDescription>Recent financial maneuvers.</CardDescription>
                </div>
                <Coins className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase">Detail</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-right">Value</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {finance.expenses.length > 0 ? (
                        finance.expenses.slice().reverse().slice(0, 8).map((expense) => (
                          <TableRow key={expense.id} className="hover:bg-muted/30">
                            <TableCell>
                              <p className="font-bold text-sm">{expense.description}</p>
                              <span className="text-[10px] font-black uppercase text-muted-foreground">{expense.category}</span>
                            </TableCell>
                            <TableCell className="text-right font-black text-foreground">
                              -${expense.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteExpense(expense.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-muted-foreground text-xs italic">
                            No transaction data logged.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
