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

          if (callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')) {
            try {
              const redirectUrl = new URL(callbackUrl, nextUrl);

              return NextResponse.redirect(redirectUrl);
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

    // Expose the MongoDB user id (saved in token.sub at sign in) to server code
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

  },
  providers: [], // os providers ficam em auth.ts
} satisfies NextAuthConfig;


