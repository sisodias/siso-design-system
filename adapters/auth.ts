/**
 * Auth Adapter Contract
 *
 * Defines the interface for authentication integration.
 * Designed to accept Clerk, NextAuth, Supabase Auth, or custom JWT as backing impl.
 */

export interface AuthUser {
  id: string
  email?: string
  name?: string
  imageUrl?: string
}

export interface AuthState {
  signedIn: boolean
  user: AuthUser | null
  signIn: () => void
  signOut: () => void
}

export interface AuthAdapter {
  useAuth(): AuthState
}

/**
 * No-op auth adapter — all operations are no-ops.
 * Use for development or when auth is not yet wired.
 */
export const noopAuth: AuthAdapter = {
  useAuth: () => ({
    signedIn: false,
    user: null,
    signIn: () => {},
    signOut: () => {},
  }),
}
