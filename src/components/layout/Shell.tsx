"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Home, Target, CheckSquare, Wallet, Sparkles, LogOut, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAscend } from "@/lib/store"

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Goal Hierarchy", url: "/goals", icon: Target },
  { title: "Daily Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Goal Assistant", url: "/assistant", icon: Sparkles },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { momentum } = useAscend()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-body">
        <Sidebar className="border-r border-border/50 bg-card/50 backdrop-blur-3xl">
          <SidebarHeader className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl ascend-gradient text-white shadow-lg shadow-primary/20">
                <TrendingUp size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground font-headline uppercase italic">Ascend</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Operations</SidebarGroupLabel>
              <SidebarGroupContent className="px-2">
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} className="px-4 py-6 rounded-xl transition-all duration-200 hover:bg-muted/30 data-[active=true]:bg-primary/10">
                        <Link href={item.url} className="flex items-center gap-4">
                          <item.icon className={`h-5 w-5 ${pathname === item.url ? "text-accent" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-bold uppercase tracking-tight ${pathname === item.url ? "text-foreground" : "text-muted-foreground"}`}>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="rounded-2xl ascend-gradient p-4 shadow-xl shadow-primary/20">
              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Momentum Core</p>
              <div className="flex items-center justify-between text-white">
                <span className="text-xl font-black">{momentum}<span className="text-sm opacity-60">/100</span></span>
                <Zap className="h-5 w-5 fill-white animate-pulse" />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth">
          <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-3xl font-black text-foreground font-headline flex items-center gap-2">
                  Unit: Achiever
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                </h1>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Operational Status: Optimal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase">Current Cycle</p>
                <p className="text-sm font-bold">Q1 / 2024</p>
              </div>
              <div className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center group cursor-pointer hover:border-accent transition-colors">
                <Sparkles className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
