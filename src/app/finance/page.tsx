"use client"

import { AppShell } from "@/components/layout/Shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAscend } from "@/lib/store"
import { Wallet, PieChart, Landmark, Heart, PiggyBank, Briefcase } from "lucide-react"

export default function FinancePage() {
  const { finance, setIncome } = useAscend()

  const categories = [
    { label: "Savings", icon: PiggyBank, percent: 30, color: "text-blue-500", bg: "bg-blue-500/10", value: finance.allocations.savings },
    { label: "Daily Needs", icon: Briefcase, percent: 25, color: "text-green-500", bg: "bg-green-500/10", value: finance.allocations.dailyNeeds },
    { label: "Investments", icon: Landmark, percent: 20, color: "text-purple-500", bg: "bg-purple-500/10", value: finance.allocations.investments },
    { label: "Tithe", icon: Heart, percent: 10, color: "text-orange-500", bg: "bg-orange-500/10", value: finance.allocations.tithe },
    { label: "Charity", icon: Heart, percent: 5, color: "text-pink-500", bg: "bg-pink-500/10", value: finance.allocations.charity },
  ]

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black font-headline text-foreground">Financial Fortress</h1>
            <p className="text-muted-foreground">Automated 10/30/5/20/25 allocation strategy.</p>
          </div>
          <Card className="w-full md:w-64 border-primary shadow-xl shadow-primary/10">
            <CardContent className="p-4 space-y-2">
              <Label htmlFor="income" className="text-xs font-bold uppercase text-muted-foreground">Monthly Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <Input 
                  id="income" 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-8 font-black text-lg border-none bg-primary/5 focus-visible:ring-primary"
                  value={finance.monthlyIncome || ""}
                  onChange={(e) => setIncome(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Allocation Breakdown
              </CardTitle>
              <CardDescription>How your monthly income is distributed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.label} className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${cat.bg} flex items-center justify-center ${cat.color}`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-foreground">{cat.label}</span>
                      <span className="font-black text-primary">${cat.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{cat.percent}% allocation</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-primary text-primary-foreground relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-10">
               <Wallet size={200} />
             </div>
             <CardHeader>
               <CardTitle className="text-2xl font-black">Financial Freedom</CardTitle>
               <CardDescription className="text-primary-foreground/70">Strategic allocation yields long-term wealth.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-8 mt-4">
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                 <p className="text-sm font-medium mb-1 opacity-80 text-white">Total Annual Potential</p>
                 <h2 className="text-4xl font-black text-white">${(finance.monthlyIncome * 12).toLocaleString()}</h2>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <p className="text-xs opacity-70 mb-1 text-white">Annual Savings</p>
                   <p className="text-xl font-bold text-white">${(finance.allocations.savings * 12).toLocaleString()}</p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <p className="text-xs opacity-70 mb-1 text-white">Annual Investments</p>
                   <p className="text-xl font-bold text-white">${(finance.allocations.investments * 12).toLocaleString()}</p>
                 </div>
               </div>

               <div className="pt-4 border-t border-white/10">
                 <p className="text-sm italic opacity-80">"A budget is telling your money where to go instead of wondering where it went."</p>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
