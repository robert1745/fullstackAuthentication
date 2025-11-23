import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ispublicPath = ['/login', '/signup'].includes(path);

  const token = request.cookies.get('token')?.value;
  
  if (!ispublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if(ispublicPath && token){
    const profileUrl = new URL('/', request.url);
    return NextResponse.redirect(profileUrl);
  }
}
 

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
}