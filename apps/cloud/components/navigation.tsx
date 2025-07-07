'use client';

import { cn } from '@repo/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/telemetry', label: 'Telemetry' },
  { href: '/api/health', label: 'API Health', external: true },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              FleetOps Cloud
            </Link>
            <div className="flex gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                  {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            AWS Region: {process.env.NEXT_PUBLIC_AWS_REGION || 'Not configured'}
          </div>
        </div>
      </div>
    </nav>
  );
}