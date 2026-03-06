"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Home, Target, CheckSquare, Wallet, Sparkles, LogOut, TrendingUp, Zap, Trophy, Flame, Volume2, VolumeX, BarChart3, Settings, ClipboardCheck, Menu, Command, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAscend } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useTheme } from "next-themes"

const items = [
  { title: "Dashboard", url: "/", icon: Home, shortcut: "D" },
  { title: "Goal Hierarchy", url: "/goals", icon: Target, shortcut: "G" },
  { title: "Daily Tasks", url: "/tasks", icon: CheckSquare, shortcut: "T" },
  { title: "Finance", url: "/finance", icon: Wallet, shortcut: "F" },
  { title: "Mission Review", url: "/review", icon: ClipboardCheck, shortcut: "R" },
  { title: "Performance Hub", url: "/performance", icon: BarChart3, shortcut: "P" },
  { title: "Rewards Center", url: "/rewards", icon: Trophy, shortcut: "W" },
  { title: "Goal Assistant", url: "/assistant", icon: Sparkles, shortcut: "A" },
  { title: "Settings", url: "/settings", icon: Settings, shortcut: "," },
]

const mobileNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Review", url: "/review", icon: ClipboardCheck },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { momentum, level, xp, streak, settings, toggleMute, user, completeOnboarding } = useAscend()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const nextLevelXp = level * 1000
  const xpProgress = (xp / nextLevelXp) * 100

  useEffect(() => {
    setMounted(true)
    if (user.onboardingCompleted === false) {
      const timer = setTimeout(() => setShowOnboarding(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [user.onboardingCompleted])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      const key = e.key.toUpperCase()
      const item = items.find(i => i.shortcut === key)
      if (item) {
        e.preventDefault()
        router.push(item.url)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-body pb-20 md:pb-0 transition-opacity duration-300">
        <Sidebar className="border-r border-border/50 bg-card/50 backdrop-blur-3xl hidden md:flex">
          <SidebarHeader className="px-6 py-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl ascend-gradient text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <TrendingUp size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground font-headline uppercase italic">Ascend</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{user.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lv. {level} Achiever</p>
                </div>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2 cursor-help">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gold flex items-center justify-center text-background font-black text-xs shadow-gold">
                            {level}
                          </div>
                          <span className="text-xs font-black uppercase text-foreground">Exp Progress</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">{xp} / {nextLevelXp} XP</span>
                      </div>
                      <Progress value={xpProgress} className="h-1.5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Gain XP by completing tasks and goals to level up.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Operations</SidebarGroupLabel>
              <SidebarGroupContent className="px-2">
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} className="px-4 py-6 rounded-xl transition-all duration-200 hover:bg-muted/30 data-[active=true]:bg-primary/10 group">
                        <Link href={item.url} className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            <item.icon className={cn("h-5 w-5", pathname === item.url ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} />
                            <span className={cn("text-sm font-bold uppercase tracking-tight", pathname === item.url ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{item.title}</span>
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground/30 group-hover:opacity-100 hidden lg:block">{item.shortcut}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                 <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
                 <span className="text-sm font-black text-foreground">{streak} Day Streak</span>
               </div>
               <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8 opacity-50 hover:opacity-100">
                        {settings.mute ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle system sounds</TooltipContent>
                 </Tooltip>
               </TooltipProvider>
            </div>
            <div className="rounded-2xl ascend-gradient p-4 shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Momentum Core</p>
              <div className="flex items-center justify-between text-white">
                <span className="text-xl font-black">{momentum}<span className="text-sm opacity-60">/100</span></span>
                <Zap className="h-5 w-5 fill-white animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest opacity-30">Ascend v1.2.0 • 2024 Achiever's Suite</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-2xl border-t border-border/50 flex items-center justify-around px-2 z-50 md:hidden">
          {mobileNavItems.map((item) => (
            <Link 
              key={item.title} 
              href={item.url} 
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] min-h-[64px] justify-center",
                pathname === item.url ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.title}</span>
            </Link>
          ))}
          <SidebarTrigger className="flex flex-col items-center gap-1 p-2 min-w-[64px] min-h-[64px] justify-center text-muted-foreground">
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">More</span>
          </SidebarTrigger>
        </nav>

        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8 scroll-smooth transition-all duration-500">
          <header className="mb-8 md:mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl ascend-gradient text-white shadow-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground font-headline flex items-center gap-2">
                  {user.name.split(' ')[0]}
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                </h1>
                <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Deployment: Active</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <div className="hidden lg:flex items-center gap-2 mr-4 bg-muted/20 px-3 py-1.5 rounded-full border border-border/50">
                  <Command className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shortcuts Active</span>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="md:hidden">
                      {settings.mute ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Sounds</TooltipContent>
                </Tooltip>

                {mounted && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-border bg-card flex items-center justify-center group cursor-pointer hover:border-accent transition-colors shadow-sm"
                      >
                        {theme === 'dark' ? (
                          <Sun className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                        ) : (
                          <Moon className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </header>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Onboarding Flow */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="bg-card/95 backdrop-blur-2xl border-none shadow-2xl max-w-lg">
          <DialogHeader>
            <div className="mx-auto h-20 w-20 rounded-3xl ascend-gradient flex items-center justify-center text-white mb-6 animate-rise shadow-2xl shadow-primary/20">
              <TrendingUp size={40} />
            </div>
            <DialogTitle className="text-3xl font-black text-center italic uppercase tracking-tighter">Initialize Ascent</DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed pt-2">
              Welcome to the elite command center for high achievers. Ascend is built to synchronize your micro-actions with your macro-vision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: "Vision", desc: "Hierarchy", icon: Target },
                 { label: "Execution", desc: "Missions", icon: CheckSquare },
                 { label: "Analysis", desc: "Metrics", icon: BarChart3 }
               ].map((mod, i) => (
                 <div key={i} className="text-center space-y-2 p-3 rounded-2xl bg-muted/20 border border-border/50">
                    <mod.icon className="h-6 w-6 mx-auto text-primary" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-foreground">{mod.label}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{mod.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex gap-4 items-center">
               <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                 <Zap className="h-6 w-6" />
               </div>
               <div>
                 <p className="text-xs font-black uppercase text-accent">Strategic Tip</p>
                 <p className="text-[10px] font-medium text-foreground">Use keyboard shortcuts (G, T, F, R) to navigate the command center with maximum velocity.</p>
               </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowOnboarding(false); completeOnboarding(); }} className="w-full bg-primary font-black py-8 rounded-2xl uppercase tracking-widest shadow-xl shadow-primary/20 text-sm">
              Commence Operations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
