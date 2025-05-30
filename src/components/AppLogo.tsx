import Link from 'next/link';
import Image from 'next/image';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors ${className}`}>
      <Image
        src="/images/logo.webp" // Corrected path
        alt="AxesFlow Logo Icon"
        width={200}
        height={28}
        className="h-70 w-70"
      />
    </Link>
  );
}
