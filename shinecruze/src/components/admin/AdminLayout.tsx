'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

function NavLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <li>
            <Link href={href} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                {children}
            </Link>
        </li>
    );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    // router.push() is a side-effect, should be in useEffect or an event handler
    // for now, we redirect from the page level. This layout is for authenticated admins.
    return <div className="flex h-screen items-center justify-center">Access Denied. Redirecting...</div>;
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-900 text-white lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <span>Shinecruze Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <ul>
                <NavLink href="/admin">Dashboard</NavLink>
                <NavLink href="/admin/bookings">Bookings</NavLink>
                <NavLink href="/admin/services">Services</NavLink>
                <NavLink href="/admin/testimonials">Testimonials</NavLink>
                <NavLink href="/admin/gallery">Gallery</NavLink>
              </ul>
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
              >
                Sign Out
              </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
            {/* Mobile Nav could go here */}
            <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
