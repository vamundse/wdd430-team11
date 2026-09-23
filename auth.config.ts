// auth.config.ts  (raiz do projeto, ao lado do package.json)
import type { NextAuthConfig } from 'next-auth';

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
        
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }  
      return isLoggedIn;
    },

  },
  providers: [], // os providers ficam em auth.ts
} satisfies NextAuthConfig;