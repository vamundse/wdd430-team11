// proxy.ts  (raiz do projeto — no Next.js 16 substitui o antigo middleware.ts)
import NextAuth from 'next-auth';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  // Repassa a requisição para o Auth.js, que aplica as regras do auth.config.ts
  return (auth as any)(request, event);
}

export const config = {
  // Roda em todas as rotas, exceto API, arquivos internos do Next.js e imagens/ícones
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
};