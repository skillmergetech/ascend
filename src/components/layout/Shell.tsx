"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Home, Target, CheckSquare, Wallet, Sparkles, LogOut, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Goal Hierarchy", url: "/goals", icon: Target },
  { title: "Daily Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Goal Assistant", url: "/assistant", icon: Sparkles },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-body">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <TrendingUp size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground font-headline">Ascend</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</SidebarGroupLabel>
              <SidebarGroupContent className="px-2">
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} className="px-4 py-6 rounded-lg transition-all duration-200">
                        <Link href={item.url} className="flex items-center gap-4">
                          <item.icon className={`h-5 w-5 ${pathname === item.url ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${pathname === item.url ? "text-primary font-semibold" : "text-foreground"}`}>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
              <p className="text-xs font-medium text-primary mb-1">Momentum Score</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">78/100</span>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8">
          <header className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-2xl font-bold text-foreground font-headline">Welcome back, Achiever</h1>
                <p className="text-muted-foreground text-sm">Your quarterly goals are calling.</p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            </div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
