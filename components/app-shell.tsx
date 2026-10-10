'use client';

import { usePathname } from 'next/navigation';

// Páginas que aparecem sem a barra lateral
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

export default function AppShell({
  navigation,
  header,
  children,
}: {
  navigation: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-0 md:w-50 flex-shrink-0 min-h-screen">{navigation}</div>
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        {header}
        {children}
      </div>
    </div>
  );
}