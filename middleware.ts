import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { SubDomains } from './enum-sudomains'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const currentHost = hostname.split(".")[0]
  const url = request.nextUrl.clone()

  if (Object.values(SubDomains).includes(currentHost as SubDomains)) {
    url.pathname = `/subdomains/${currentHost}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}