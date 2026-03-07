"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, useUser } from "@/firebase"
import { initiateEmailSignIn, initiatePasswordReset } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Loader2, Mail, Lock, ChevronRight, AlertCircle, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isResetOpen, setIsResetOpen] = useState(false)
  
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      initiateEmailSignIn(auth, email, password)
      toast({
        title: "Authorization Initiated",
        description: "Checking operational credentials...",
      })
    } catch (err: any) {
      setError(err.message || "Failed to authorize session.")
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please provide your operational email to receive a reset link.",
      })
      return
    }

    setResetLoading(true)
    try {
      await initiatePasswordReset(auth, resetEmail)
      toast({
        title: "Reset Link Dispatched",
        description: `Check ${resetEmail} for your security recovery link.`,
      })
      setIsResetOpen(false)
      setResetEmail("")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: err.message || "Could not process password recovery.",
      })
    } finally {
      setResetLoading(false)
    }
  }

  if (isUserLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl ascend-gradient text-white shadow-lg">
            <TrendingUp size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic font-headline">Ascend</h1>
          <p className="text-muted-foreground font-medium">Re-engage your high-performance command center.</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Commander Login</CardTitle>
            <CardDescription>Enter your credentials to access your trajectory.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Operational Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@agency.com" 
                    className="pl-10 h-12 bg-muted/20 border-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Security Key</Label>
                  <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        Forgot?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-card/95 backdrop-blur-2xl border-none shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Credential Recovery</DialogTitle>
                        <DialogDescription>
                          Enter your operational email and we will dispatch a secure reset link to your station.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="reset-email" className="text-xs font-black uppercase text-muted-foreground">Recovery Email</Label>
                        <Input 
                          id="reset-email"
                          type="email"
                          placeholder="name@agency.com"
                          className="mt-2 h-12 bg-muted/20 border-none font-bold"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handlePasswordReset} 
                          disabled={resetLoading}
                          className="w-full h-12 bg-primary font-black uppercase tracking-widest text-xs"
                        >
                          {resetLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Dispatch Reset Link"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 h-12 bg-muted/20 border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" disabled={loading} className="w-full h-12 bg-primary font-black uppercase tracking-widest text-xs">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Access"}
                {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">New recruit? </span>
                <Link href="/signup" className="text-primary font-bold hover:underline">
                  Join the Ascent
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
