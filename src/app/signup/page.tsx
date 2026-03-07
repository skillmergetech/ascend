
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, useUser } from "@/firebase"
import { initiateEmailSignUp } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Loader2, Mail, Lock, User, ChevronRight, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 6) {
      setError("Security key must be at least 6 characters.")
      setLoading(false)
      return
    }

    try {
      initiateEmailSignUp(auth, email, password)
      toast({
        title: "Deployment Initiated",
        description: "Establishing your secure command center...",
      })
    } catch (err: any) {
      setError(err.message || "Failed to establish operational records.")
      setLoading(false)
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
          <p className="text-muted-foreground font-medium">Begin your journey to high-performance execution.</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Enlist Now</CardTitle>
            <CardDescription>Create your account to sync your trajectory across devices.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Commander Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="pl-10 h-12 bg-muted/20 border-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
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
                <Label htmlFor="password">Security Key</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 h-12 bg-muted/20 border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" disabled={loading} className="w-full h-12 bg-primary font-black uppercase tracking-widest text-xs">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Establish Profile"}
                {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already enlisted? </span>
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Commander Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
