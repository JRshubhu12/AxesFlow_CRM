
"use client";

import Link from 'next/link';
import { Search, Folder, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AppLogo } from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navItems as appNavItems } from '@/config/nav';
import { cn } from '@/lib/utils';

// UserNav Component
interface UserNavProps {
  agencyNameProp?: string | null;
  userEmailProp?: string | null;
  agencyLogoUrlProp?: string | null;
}

function UserNav({ agencyNameProp, userEmailProp, agencyLogoUrlProp }: UserNavProps) {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState(agencyNameProp);
  const [userEmail, setUserEmail] = useState(userEmailProp);
  const [agencyLogoUrl, setAgencyLogoUrl] = useState(agencyLogoUrlProp);

  useEffect(() => {
    const loadProfileData = () => {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          setAgencyName(parsed.agencyName || "Agency Name");
          setUserEmail(parsed.contactEmail || "user@example.com");
          setAgencyLogoUrl(parsed.agencyLogoUrl);
        } catch (e) {
          console.error("Failed to parse userProfileData from localStorage", e);
          setAgencyName("Agency Name");
          setUserEmail("user@example.com");
          setAgencyLogoUrl(null);
        }
      } else {
        setAgencyName("Agency Name");
        setUserEmail("user@example.com");
        setAgencyLogoUrl(null);
      }
    };

    loadProfileData(); // Load on mount

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userProfileData') {
        loadProfileData(); // Reload when storage changes
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={agencyLogoUrl || "https://placehold.co/40x40.png?text=A"} alt={agencyName || "User"} data-ai-hint="logo company"/>
            <AvatarFallback>{agencyName ? agencyName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 absolute right-[-8px] bottom-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{agencyName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// PageTitleDisplay Component
function PageTitleDisplay() {
  const pathname = usePathname();
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Find the current nav item based on the path
    // Prioritize exact matches or longer paths for nested routes
    let currentNavItem = appNavItems
      .slice() // Create a copy to sort
      .sort((a, b) => b.href.length - a.href.length) // Sort by href length descending
      .find(item => pathname.startsWith(item.href));

    let pageTitle = "Dashboard"; // Default title
    if (currentNavItem) {
      pageTitle = currentNavItem.title;
    } else if (pathname === '/profile') {
      pageTitle = 'Profile';
    } else if (pathname === '/settings') {
      pageTitle = 'Settings';
    } else if (pathname.startsWith('/projects/') && pathname !== '/projects') {
      pageTitle = 'Project Details';
    } else if (pathname.startsWith('/activity')) {
      pageTitle = 'Activity Log';
    }
    setTitle(pageTitle);
  }, [pathname]);

  return <h1 className="text-xl font-semibold text-foreground">{title}</h1>;
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navItems = appNavItems;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-60 border-r bg-sidebar-background p-0 sticky top-0 h-screen flex flex-col">
        <div className="mb-3 px-4 pt-5 pb-3">
          <AppLogo />
        </div>
        <nav className="space-y-1 px-3 overflow-y-auto flex-grow">
          {navItems.map((item) => {
            const isActive = (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && item.href.length > '/dashboard'.length));
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors",
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
                    : 'text-foreground font-normal hover:bg-muted hover:text-foreground'
                )}
                title={item.tooltip || item.title}
              >
                {/* Icon removed to match new design */}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto"> {/* This container handles main content scrolling */}
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-card px-6 py-3">
          <div className="flex items-center">
            <PageTitleDisplay />
          </div>

          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="search for features, settings and more"
                className="w-full rounded-lg bg-background pl-10 pr-4 h-9 text-sm focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 h-9 w-9">
              <Folder className="h-5 w-5" />
              <span className="sr-only">Folder</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <UserNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6"> {/* This is where the page-specific content will scroll */}
          {children}
        </main>
      </div>
    </div>
  );
}
