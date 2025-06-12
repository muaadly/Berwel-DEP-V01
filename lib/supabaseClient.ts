import { createBrowserClient } from '@supabase/ssr';
// We won't use createRouteHandlerClient here as this is for the client side

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Function to create and return a Supabase client instance
export function createClient() {
  const isProd = process.env.NODE_ENV === 'production'; // Determine if in production environment

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          if (typeof document !== 'undefined') {
            const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
            return cookie ? cookie.split('=')[1] : null;
          }
          return null;
        },
        set(name: string, value: string, options: any) {
          if (typeof document !== 'undefined') {
            let cookieString = `${name}=${value}; path=${options.path || '/'};`;
            if (options.expires) {
              cookieString += ` expires=${options.expires.toUTCString()};`;
            }
            if (options.maxAge) {
              cookieString += ` Max-Age=${options.maxAge};`;
            }
            cookieString += ` SameSite=Lax;`; // Keep SameSite=Lax for compatibility
            if (isProd) { // Add Secure attribute only in production (HTTPS)
              cookieString += ` Secure;`;
            }
            document.cookie = cookieString;
          }
        },
        remove(name: string, options: any) {
          if (typeof document !== 'undefined') {
            let cookieString = `${name}=; Max-Age=-99999999; path=${options.path || '/'};`;
            cookieString += ` SameSite=Lax;`; // Keep SameSite=Lax
            if (isProd) { // Add Secure attribute only in production (HTTPS)
              cookieString += ` Secure;`;
            }
            document.cookie = cookieString;
          }
        },
      },
    }
  );
}

// Export a default instance for convenience.
// The UserProvider will use `createClient()` directly inside useEffect, which is the correct pattern.
const supabase = createClient();
export default supabase; 