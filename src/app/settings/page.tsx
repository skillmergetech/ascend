"use client"

import { AppShell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAscend } from "@/lib/store"
import { User, Settings as SettingsIcon, Shield, Download, Trash2, Moon, Sun, Bell, Globe, Sparkles, Camera, History } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

const AVATAR_OPTIONS = [
  "user", "star", "zap", "shield", "rocket", "flame", "target", "trophy"
].map(seed => `https://picsum.photos/seed/${seed}/200/200`)

export default function SettingsPage() {
  const { user, updateUser, settings, updateSettings, exportData, resetData, level, xp, achievements } = useAscend()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(user.name)

  const handleUpdateName = () => {
    if (name.trim()) {
      updateUser({ name })
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-black font-headline tracking-tighter uppercase italic">Control Center</h1>
          </div>
          <p className="text-muted-foreground font-medium">Fine-tune your identity and operational parameters.</p>
        </header>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 mb-8">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2"><SettingsIcon className="h-4 w-4" /> Preferences</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" /> Data & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <Card className="md:col-span-4 border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Identity Icon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative group mx-auto w-32 h-32">
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full rounded-3xl object-cover shadow-2xl border-4 border-primary/20" 
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Camera className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((url, i) => (
                      <button 
                        key={i} 
                        onClick={() => updateUser({ avatar: url })}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          user.avatar === url ? "border-primary scale-95" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={url} alt="Option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-8 space-y-6">
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-muted-foreground">Commander Name</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="bg-muted/30 border-none h-12 font-bold"
                        />
                        <Button onClick={handleUpdateName} className="bg-primary h-12">Update</Button>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center gap-6">
                       <div className="flex-1 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                          <p className="text-[10px] font-black uppercase text-primary mb-1">Join Date</p>
                          <p className="font-bold flex items-center gap-2">
                            <History className="h-4 w-4" />
                            {user.joinDate}
                          </p>
                       </div>
                       <div className="flex-1 p-4 rounded-2xl bg-accent/10 border border-accent/20">
                          <p className="text-[10px] font-black uppercase text-accent mb-1">Operational Rank</p>
                          <p className="font-bold flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Level {level}
                          </p>
                       </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
                   <CardHeader>
                     <CardTitle className="text-lg font-bold">Statistics Summary</CardTitle>
                   </CardHeader>
                   <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Total XP", value: xp.toLocaleString() },
                        { label: "Level", value: level },
                        { label: "Awards", value: achievements.filter(a => a.unlockedAt).length },
                        { label: "Efficiency", value: "Top 1%" },
                      ].map((stat, i) => (
                        <div key={i} className="text-center p-3 rounded-xl bg-muted/20">
                          <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-lg font-black">{stat.value}</p>
                        </div>
                      ))}
                   </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Visual & System Environment</CardTitle>
                <CardDescription>Adjust how the application responds to your presence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Interface Mode</Label>
                    <p className="text-xs text-muted-foreground">Switch between Light and Dark core visuals.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
                    <Button 
                      variant={theme === 'light' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setTheme('light')}
                      className="rounded-lg"
                    >
                      <Sun className="h-4 w-4 mr-2" /> Light
                    </Button>
                    <Button 
                      variant={theme === 'dark' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setTheme('dark')}
                      className="rounded-lg"
                    >
                      <Moon className="h-4 w-4 mr-2" /> Dark
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Currency Unit</Label>
                    <p className="text-xs text-muted-foreground">Set your primary financial denominator.</p>
                  </div>
                  <Select value={settings.currency} onValueChange={(v) => updateSettings({ currency: v })}>
                    <SelectTrigger className="w-[120px] bg-muted/50 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Audio Feedback</Label>
                    <p className="text-xs text-muted-foreground">System sounds for task completion and rewards.</p>
                  </div>
                  <Switch checked={!settings.mute} onCheckedChange={(v) => updateSettings({ mute: !v })} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Operational Reminders</Label>
                    <p className="text-xs text-muted-foreground">Receive browser notifications for mission cycles.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="time" 
                      value={settings.reminderTime} 
                      onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                      className="w-[120px] bg-muted/50 border-none"
                    />
                    <Switch checked={settings.notifications} onCheckedChange={(v) => updateSettings({ notifications: v })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Data Management</CardTitle>
                <CardDescription>You maintain absolute control over your operational history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                   <div className="space-y-1">
                     <h4 className="font-bold flex items-center gap-2">
                       <Download className="h-4 w-4 text-primary" />
                       Strategic Export
                     </h4>
                     <p className="text-xs text-muted-foreground">Download all goals, tasks, and finance records as a JSON file.</p>
                   </div>
                   <Button onClick={exportData} variant="outline" className="border-primary/30 hover:bg-primary/10">Download Archive</Button>
                </div>

                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center justify-between">
                   <div className="space-y-1">
                     <h4 className="font-bold text-destructive flex items-center gap-2">
                       <Trash2 className="h-4 w-4" />
                       Nuclear Decommission
                     </h4>
                     <p className="text-xs text-muted-foreground">Wipe all local operational records. This action is irreversible.</p>
                   </div>
                   
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <Button variant="destructive">Reset All Data</Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent className="bg-card border-none shadow-2xl">
                       <AlertDialogHeader>
                         <AlertDialogTitle className="text-2xl font-black">Authorize Deletion?</AlertDialogTitle>
                         <AlertDialogDescription>
                           This will permanently erase your entire trajectory, achievements, and financial history. Your progress level will return to zero.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel className="rounded-xl">Abort Mission</AlertDialogCancel>
                         <AlertDialogAction onClick={resetData} className="bg-destructive hover:bg-destructive/90 rounded-xl">Execute Reset</AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                </div>

                <div className="pt-6 border-t border-border/50">
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Shield className="h-4 w-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Encryption Status: Local-Only Sovereign Vault</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}