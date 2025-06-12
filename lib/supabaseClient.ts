import { createBrowserClient } from '@supabase/ssr';
// We won't use createRouteHandlerClient here as this is for the client side

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Create a single supabase client for interacting with your database from the browser
const supabase = createBrowserClient(
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
          // Explicitly set SameSite and remove Secure for localhost http
          let cookieString = `${name}=${value}; path=${options.path || '/'};`
          if (options.expires) {
             cookieString += ` expires=${options.expires.toUTCString()};`;
          }
           if (options.maxAge) {
             cookieString += ` Max-Age=${options.maxAge};`;
           }
          cookieString += ` SameSite=Lax`; // Removed Secure
          document.cookie = cookieString;
        }
      },
      remove(name: string, options: any) {
         if (typeof document !== 'undefined') {
           // Explicitly set SameSite and remove Secure for localhost http
           let cookieString = `${name}=; Max-Age=-99999999; path=${options.path || '/'};`
           cookieString += ` SameSite=Lax`; // Removed Secure
           document.cookie = cookieString;
         }
      },
    },
  }
);

export function createClient() {
  console.log('Client Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document !== 'undefined') {
            const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
            console.log(`Client Get Cookie - Name: ${name}, Value: ${cookie ? cookie.split('=')[1] : null}`);
            return cookie ? cookie.split('=')[1] : null;
          }
          return null;
        },
        set(name: string, value: string, options: any) {
          if (typeof document !== 'undefined') {
            // Explicitly set SameSite and remove Secure for localhost http
            let cookieString = `${name}=${value}; path=${options.path || '/'};`
            if (options.expires) {
               cookieString += ` expires=${options.expires.toUTCString()};`;
            }
             if (options.maxAge) {
               cookieString += ` Max-Age=${options.maxAge};`;
             }
            cookieString += ` SameSite=Lax`; // Removed Secure
            console.log(`Client Set Cookie - Name: ${name}, Value: ${value}, Options: ${JSON.stringify(options)}, Setting: ${cookieString}`);
            document.cookie = cookieString;
          }
        },
        remove(name: string, options: any) {
           if (typeof document !== 'undefined') {
             // Explicitly set SameSite and remove Secure for localhost http
             let cookieString = `${name}=; Max-Age=-99999999; path=${options.path || '/'};`
             cookieString += ` SameSite=Lax`; // Removed Secure
             console.log(`Client Remove Cookie - Name: ${name}, Options: ${JSON.stringify(options)}, Setting: ${cookieString}`);
             document.cookie = cookieString;
           }
        },
      },
    }
  )
}

export default supabase; 