
"use client";

import Link from 'next/link';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
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
    let pageTitle = "Dashboard"; // Default title

    // Find the main nav item based on the path
    const mainNavItem = appNavItems
      .slice()
      .sort((a, b) => b.href.length - a.href.length)
      .find(item => pathname.startsWith(item.href));

    if (mainNavItem) {
      // Check if the current path matches a sub-item
      const subNavItem = mainNavItem.subItems?.find(sub => pathname === sub.href);
      if (subNavItem) {
        pageTitle = subNavItem.title;
      } else {
        pageTitle = mainNavItem.title;
      }
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

// Custom Folder SVG Icon
const CustomFolderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4 5C4 3.89543 4.89543 3 6 3H11.5858C12.1139 3 12.6178 3.21071 13 3.58579L14.4142 5H18C19.1046 5 20 5.89543 20 7V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V5Z" fillOpacity="0.5" />
    <path d="M3.23622 8.5C3.08396 7.67157 3.67157 7 4.5 7H19.5C20.3284 7 20.916 7.67157 20.7638 8.5L18.7638 18.5C18.6476 19.1449 18.1449 19.6476 17.5 19.7638L17.5 19.7638C16.8284 19.8895 16.3153 20 12 20C7.68471 20 7.17157 19.8895 6.5 19.7638L6.5 19.7638C5.85506 19.6476 5.35245 19.1449 5.23622 18.5L3.23622 8.5Z" />
  </svg>
);


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
            const isActive = (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && item.href.length >= ('/dashboard'.length)));
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
                {/* Sub-items rendering logic can be added here if needed, or handled differently based on design */}
                 {isActive && item.subItems && item.subItems.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-0.5">
                    {item.subItems.map(subItem => (
                      <li key={subItem.title}>
                        <Link
                          href={subItem.href}
                           className={cn(
                            "group flex items-center px-2 py-1.5 text-xs rounded-md transition-colors w-full",
                            pathname === subItem.href
                              ? 'text-primary-foreground font-semibold' // Active sub-item uses primary-foreground
                              : 'text-primary-foreground/80 hover:text-primary-foreground' // Inactive sub-item
                          )}
                          title={subItem.tooltip || subItem.title}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
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
              <CustomFolderIcon className="h-5 w-5" />
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
