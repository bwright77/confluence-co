// Types for the OMP admin platform (grant seeking + governance), ported from
// wright-adventures. Kept separate from the marketing site's content types.

export type UserRole = 'admin' | 'manager' | 'member' | 'viewer'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}
