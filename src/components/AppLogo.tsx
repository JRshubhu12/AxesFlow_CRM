import Link from 'next/link';
import { Shield } from 'lucide-react'; // Changed from Activity to Shield

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors ${className}`}>
      <Shield className="h-7 w-7 text-primary" /> {/* Changed icon here */}
      <span className="text-primary">AxesFlow</span>
    </Link>
  );
}
