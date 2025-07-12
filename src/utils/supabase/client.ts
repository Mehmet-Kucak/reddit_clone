import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie
            .split(";")
            .map((cookie) => cookie.trim().split("="))
            .reduce((acc, [name, value]) => {
              if (name && value) {
                acc.push({ name, value });
              }
              return acc;
            }, [] as { name: string; value: string }[]);
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Enhanced cookie options for better mobile compatibility
            const cookieOptions = {
              ...options,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              path: "/",
            };

            let cookieString = `${name}=${value}`;
            if (cookieOptions.maxAge)
              cookieString += `; Max-Age=${cookieOptions.maxAge}`;
            if (cookieOptions.path)
              cookieString += `; Path=${cookieOptions.path}`;
            if (cookieOptions.domain)
              cookieString += `; Domain=${cookieOptions.domain}`;
            if (cookieOptions.sameSite)
              cookieString += `; SameSite=${cookieOptions.sameSite}`;
            if (cookieOptions.secure) cookieString += `; Secure`;

            document.cookie = cookieString;
          });
        },
      },
    }
  );
}

// Legacy export for backward compatibility
const supabase = createClient();
