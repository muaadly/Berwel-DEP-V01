import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Callback Route - Incoming Request Headers:', request.headers);

  if (code) {
    const cookieStore = await cookies()
    
    // Log the code_verifier cookie value
    const codeVerifier = cookieStore.get('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0] + '-auth-token-code-verifier')?.value;
    console.log('Callback Route - Code Verifier Cookie:', codeVerifier);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name) => {
            const cookie = await cookieStore.get(name)
            return cookie?.value
          },
          set: async (name, value, options) => {
            await cookieStore.set(name, value, options)
          },
          remove: async (name, options) => {
            await cookieStore.set(name, '', options)
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Error exchanging code for session:', error.message);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}