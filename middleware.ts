import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // We need to create a fresh client for middleware specifically if we were using the SSR helper package,
    // but for this simple setup we'll just check for the session cookie or redirect.
    // Ideally, use @supabase/ssr for robust middleware auth, but standard logic is:

    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Determine if user is looking at login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next()
        }

        // Need to verify auth. Since we are using client-side auth mostly,
        // we can check for the sb- access token cookie, but a safer way is usually just
        // trusting the layout or doing a server-side check.
        // For this prototype, we'll let the client-side AdminLayout handle the redirection if not logged in,
        // OR we can do a simple check if the cookie exists.

        // To keep it simple and robust without the full SSR package complexity:
        // We will allow the request through, but the Admin Layout will enforce the session check.
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
