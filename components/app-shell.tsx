'use client';

import { usePathname } from 'next/navigation';

// Páginas que aparecem sem a barra lateral
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

export default function AppShell({
  navigation,
  children,
}: {
  navigation: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-shrink-0 w-50 min-h-screen">{navigation}</div>
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  );
}