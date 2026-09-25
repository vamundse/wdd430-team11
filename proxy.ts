// proxy.ts  (raiz do projeto — no Next.js 16 substitui o antigo middleware.ts)
import { auth } from './auth';

export default auth(() => {});

export const config = {
  // Roda em todas as rotas, exceto API, arquivos internos do Next.js e imagens/ícones
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
};