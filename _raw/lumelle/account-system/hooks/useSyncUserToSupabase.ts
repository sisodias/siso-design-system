import { useEffect, useRef } from 'react'
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'
import { createSupabaseClient, supabase } from '@platform/storage/supabase'
import { getClerkSupabaseToken } from '@platform/auth/clerkSupabaseToken'

const TABLE = 'customers'

type CustomerRow = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
  username: string | null
  phone: string | null
  avatar_url: string | null
  last_sign_in_at: string
  updated_at: string
}

export const useSyncUserToSupabase = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useClerkAuth()
  const lastSyncedFingerprint = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    const fingerprint = `${user.id}:${user.updatedAt ?? user.lastSignInAt ?? ''}`
    if (lastSyncedFingerprint.current === fingerprint) return
    lastSyncedFingerprint.current = fingerprint

    const nowISO = new Date().toISOString()
    const payload: CustomerRow = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      first_name: user.firstName ?? null,
      last_name: user.lastName ?? null,
      full_name: user.fullName ?? null,
      username: user.username ?? null,
      phone: user.primaryPhoneNumber?.phoneNumber ?? null,
      avatar_url: user.imageUrl ?? null,
      last_sign_in_at: nowISO,
      updated_at: nowISO,
    }

    const sync = async () => {
      const { token } = await getClerkSupabaseToken(getToken)
      const client = token ? createSupabaseClient(token) : supabase
      if (!client) return
      const { error } = await client.from(TABLE).upsert(payload, { onConflict: 'id' })
      if (error) {
        console.error('Failed to sync Clerk user to Supabase', error)
        lastSyncedFingerprint.current = null
      }
    }

    void sync()
  }, [getToken, isLoaded, isSignedIn, user])
}
