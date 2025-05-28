
"use client";

import Link from 'next/link';
import { Search, Folder, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'; // Icons for header
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
import { navItems as appNavItems } from '@/config/nav'; // Using appNavItems from config
import { cn } from '@/lib/utils';

// UserNav Component (handles user avatar and dropdown menu)
interface UserNavProps {
  agencyName?: string | null;
  userEmail?: string | null;
  agencyLogoUrl?: string | null;
}

function UserNav({ agencyName, userEmail, agencyLogoUrl }: UserNavProps) {
  const router = useRouter();
  const [currentAgencyName, setCurrentAgencyName] = useState(agencyName);
  const [currentUserEmail, setCurrentUserEmail] = useState(userEmail);
  const [currentAgencyLogoUrl, setCurrentAgencyLogoUrl] = useState(agencyLogoUrl);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfileData');
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setCurrentAgencyName(parsed.agencyName);
        setCurrentUserEmail(parsed.contactEmail);
        setCurrentAgencyLogoUrl(parsed.agencyLogoUrl);
      } catch (e) {
        console.error("Failed to parse userProfileData from localStorage", e);
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userProfileData' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setCurrentAgencyName(parsed.agencyName);
          setCurrentUserEmail(parsed.contactEmail);
          setCurrentAgencyLogoUrl(parsed.agencyLogoUrl);
        } catch (e) {
          console.error("Failed to parse updated userProfileData from localStorage", e);
        }
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
            <AvatarImage src={currentAgencyLogoUrl || "https://placehold.co/40x40.png?text=A"} alt={currentAgencyName || "User"} data-ai-hint="logo company"/>
            <AvatarFallback>{currentAgencyName ? currentAgencyName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 absolute right-[-8px] bottom-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentAgencyName || "Agency Name"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUserEmail || "user@example.com"}
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
    const currentNavItem = appNavItems.find(item => pathname.startsWith(item.href) || pathname === item.href);
    let pageTitle = "Dashboard"; 
    if (currentNavItem) {
      pageTitle = currentNavItem.title;
    } else if (pathname === '/profile') {
      pageTitle = 'Profile';
    } else if (pathname === '/settings') {
      pageTitle = 'Settings';
    } else if (pathname.startsWith('/projects/')) {
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
  const navItems = appNavItems; // Use navItems from config

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-60 border-r bg-sidebar-background p-0">
        <div className="mb-3 px-4 pt-5 pb-3">
          <AppLogo />
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
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
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
