import Link from 'next/link';
import Image from 'next/image';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors ${className}`}>
      <Image
        src="https://placehold.co/28x28.png" // Replace with '/images/axesflow-logo-icon.png'
        alt="AxesFlow Logo Icon"
        width={28}
        height={28}
        className="h-7 w-7"
        data-ai-hint="logo brand"
      />
      <span className="text-primary">AxesFlow</span>
    </Link>
  );
}
