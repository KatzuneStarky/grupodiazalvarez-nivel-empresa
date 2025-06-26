import type { NextRequest } from 'next/server'
import { SubDomains } from './enum-sudomains';
import { NextResponse } from 'next/server'
import { auth } from './firebase/server';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const currentHost = hostname.split('.')[0];
    const url = request.nextUrl.clone();

    if (Object.values(SubDomains).includes(currentHost as SubDomains)) {
        url.pathname = `/subdomains/${currentHost}${url.pathname}`;

        const token = request.cookies.get("firebaseAuthToken")?.value
        if (token) {
            try {
                const decoded = await auth.verifyIdToken(token)

                {/**
                    const userEmpresaId = decoded.empresaId
                    if (userEmpresaId && userEmpresaId !== currentHost) {
                        return NextResponse.redirect(new URL("/acceso-denegado", request.url))
                    }
                */}

                request.headers.set("x-user-id", decoded.uid)
                request.headers.set("x-user-email", decoded.email || "")

                return NextResponse.rewrite(url);
            } catch (error) {
                console.error("Token inválido", error)
                return NextResponse.redirect(new URL("/entrar", request.url))
            }
        }else {
            return NextResponse.redirect(new URL("/entrar", request.url))
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}