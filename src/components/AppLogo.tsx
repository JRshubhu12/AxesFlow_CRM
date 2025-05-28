import Link from 'next/link';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors ${className}`}>
      <svg
        width="28" // Adjusted size to better match text
        height="28"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-primary" // Use existing class for color and sizing consistency
      >
        {/* Shadow/depth effect - slightly offset darker version */}
        <path
          d="M50 10 L15 90 L25 90 L50 30 L75 90 L85 90 L50 10 Z"
          fill="hsl(248, 53%, 53%)" // A slightly darker shade of primary for shadow
        />
        {/* Main "A" shape */}
        <path
          d="M50 8 L13 88 L23 88 L50 28 L77 88 L87 88 L50 8 Z"
          fill="currentColor" // Uses the primary color from Tailwind
        />
        {/* Flame cutout - white */}
        <path
          d="M50 55 C55 50 60 50 60 60 C60 70 50 75 50 80 C50 75 40 70 40 60 C40 50 45 50 50 55 Z"
          fill="hsl(var(--background))" // Use background color for the cutout to appear transparent
        />
      </svg>
      <span className="text-primary">AxesFlow</span>
    </Link>
  );
}
