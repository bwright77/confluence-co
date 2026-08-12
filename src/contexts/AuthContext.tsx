import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { Profile } from '../lib/adminTypes'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  /** False until the Supabase env is set — lets the UI show a clear message. */
  configured: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const NOT_CONFIGURED = {
  error: 'Sign-in is not available yet — the admin backend has not been configured.',
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Wraps the WHOLE app so useAuth works on /login and /admin. It must stay inert
// on the marketing site: it never throws at mount, and because getSupabase()
// dynamically imports the client, supabase-js isn't in the public bundle. When
// unconfigured it resolves to signed-out/not-loading and /admin bounces to /login.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    let active = true
    let unsubscribe = () => {}

    getSupabase()
      .then((supabase) => {
        if (!active) return
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          if (!active) return
          setSession(s)
          if (s) loadProfile(s.user.id)
          else setLoading(false)
        })
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, s) => {
          setSession(s)
          if (s) {
            loadProfile(s.user.id)
          } else {
            setProfile(null)
            setLoading(false)
          }
        })
        unsubscribe = () => subscription.unsubscribe()
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  async function loadProfile(userId: string) {
    const supabase = await getSupabase()
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  async function signInWithEmail(email: string, password: string) {
    if (!isSupabaseConfigured()) return NOT_CONFIGURED
    const supabase = await getSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured()) return NOT_CONFIGURED
    const supabase = await getSupabase()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    if (!isSupabaseConfigured()) return
    const supabase = await getSupabase()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        profile,
        session,
        loading,
        configured: isSupabaseConfigured(),
        signInWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
