import Link from 'next/link';
import { Activity } from 'lucide-react'; // Or your preferred logo icon

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors ${className}`}>
      {/* The image shows a stylized 'A' but Activity is the current icon. Keeping Activity for now, but styling it with primary color. */}
      <Activity className="h-7 w-7 text-primary" /> 
      <span className="text-primary">AxesFlow</span>
    </Link>
  );
}
