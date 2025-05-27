import Link from 'next/link';
import { Activity } from 'lucide-react';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 text-xl font-bold text-sidebar-primary hover:text-sidebar-accent transition-colors ${className}`}>
      <Activity className="h-7 w-7" />
      <span>AxesFlow</span>
    </Link>
  );
}
