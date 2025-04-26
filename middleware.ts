import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const protectedPaths = ["/meals", "/dashboard", "/profile"]
  const isPathProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (isPathProtected) {
    const token = await getToken({ req: request })

    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL(`/login`, request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // Check for admin-only routes
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/meals", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/meals/:path*", "/dashboard/:path*", "/profile/:path*"],
}
