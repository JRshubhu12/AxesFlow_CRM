
"use client";

import Link from 'next/link'; // Added missing import
import { Home, Users, Mail, MessageSquare, Briefcase, CheckSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react'; // Added for children type

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Campaigns', href: '/email-campaigns', icon: Mail }, // Matched path from existing nav.ts for campaigns
    { name: 'Talks', href: '/communications', icon: MessageSquare }, // Matched path from existing nav.ts for communications
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Teams', href: '/team', icon: Users }, // Matched path from existing nav.ts for team
  ];

  return (
    <div className="flex min-h-screen bg-background"> {/* Added bg-background for consistency */}
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4"> {/* Changed bg-white to bg-card */}
        <div className="mb-8 p-2">
          <h1 className="text-xl font-bold text-foreground">AxesFlow</h1> {/* Changed text-gray-800 to text-foreground */}
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) // Improved active check for nested routes
                    ? 'bg-primary text-primary-foreground' // Use theme colors
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary' // Use theme colors
                }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors
                  ${
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) // Improved active check
                      ? 'text-primary-foreground' // Use theme color
                      : 'text-muted-foreground group-hover:text-primary' // Use theme color
                  }`}
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"> {/* Added padding to main content area */}
        {children}
      </div>
    </div>
  );
}
