// auth.config.ts  (raiz do projeto, ao lado do package.json)
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login', // para onde mandar quem não está logado
  },
  callbacks: {

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(
        nextUrl.pathname,
      );

      if (isAuthPage) {
        if (isLoggedIn) {
          const callbackUrl = nextUrl.searchParams.get('callbackUrl');

          if (callbackUrl) {
            try {
              const redirectUrl = new URL(callbackUrl, nextUrl);

              if (redirectUrl.origin === nextUrl.origin) {
                return NextResponse.redirect(redirectUrl);
              }
            } catch {
              // Fall back to the home page when callbackUrl is malformed.
            }
          }

          return NextResponse.redirect(new URL('/', nextUrl));
        }
        return true;
      }
      return isLoggedIn;
    },

  },
  providers: [], // os providers ficam em auth.ts
} satisfies NextAuthConfig;