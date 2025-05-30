
"use client";

import Link from 'next/link';
import { Search, ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react'; // Removed Bell, Folder
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

  useEffect(() => {
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

    const findNavItem = (items: typeof appNavItems, currentPath: string): string | null => {
      for (const item of items) {
        if (currentPath.startsWith(item.href)) {
          // Check sub-items first
          if (item.subItems) {
            const subNavItemTitle = findNavItem(item.subItems, currentPath);
            if (subNavItemTitle) return subNavItemTitle;
          }
          // If no sub-item matched or no sub-items, return parent title if it's a closer match
          if (currentPath === item.href || currentPath.startsWith(item.href + '/')) {
            return item.title;
          }
        }
      }
      return null;
    };
    
    // Sort navItems to check more specific paths first
    const sortedNavItems = [...appNavItems].sort((a, b) => b.href.length - a.href.length);
    const navItemTitle = findNavItem(sortedNavItems, pathname);

    if (navItemTitle) {
      pageTitle = navItemTitle;
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

// Custom Folder SVG Icon - Based on the two-tone blue folder image
const CustomFolderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    {/* Darker Blue Tab */}
    <path d="M9 3H4C2.89543 3 2 3.89543 2 5V8H22V7C22 5.89543 21.1046 5 20 5H11L9 3Z" fill="#4285F4"/>
    {/* Lighter Blue Body */}
    <path d="M2 8V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V8H2Z" fill="#73A9FF"/>
  </svg>
);

// Custom Bell SVG Icon - Based on the accent blue bell image
const CustomBellIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="hsl(var(--accent))"
  >
    <path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM19.5 17.5C19.5 17.5 19 14.5 19 11C19 7.13401 15.866 4 12 4C8.13401 4 5 7.13401 5 11C5 14.5 4.5 17.5 4.5 17.5H19.5Z" />
  </svg>
);


export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navItems = appNavItems; // Use the imported navItems

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-60 border-r bg-sidebar-background p-0 sticky top-0 h-screen flex flex-col">
        <div className="mb-3 px-4 pt-5 pb-3"> {/* Adjusted AppLogo spacing */}
          <AppLogo />
        </div>
        <nav className="space-y-1 px-3 overflow-y-auto flex-grow">
          {navItems.map((item) => {
            const isParentActive = pathname.startsWith(item.href);
            const isActive = (pathname === item.href || (item.href !== '/dashboard' && isParentActive && item.href.length >= ('/dashboard'.length)));

            return (
              <div key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 rounded-md transition-colors text-sm", // text-sm for nav items
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90' // Active: primary bg, white text, medium font
                      : 'text-foreground font-normal hover:bg-muted hover:text-foreground' // Inactive: dark text, normal font
                  )}
                  title={item.tooltip || item.title}
                >
                  {/* Icons are removed from sidebar items as per image reference */}
                  <span>{item.title}</span>
                </Link>
                {isActive && item.subItems && item.subItems.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-0.5 pl-3 border-l border-primary/20">
                    {item.subItems.map(subItem => (
                      <li key={subItem.title}>
                        <Link
                          href={subItem.href}
                           className={cn(
                            "group flex items-center px-2 py-1.5 text-xs rounded-md transition-colors w-full",
                            pathname === subItem.href
                              ? 'text-primary-foreground font-semibold' 
                              : 'text-primary-foreground/80 hover:text-primary-foreground' 
                          )}
                          title={subItem.tooltip || subItem.title}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-9 w-9">
              <CustomFolderIcon className="h-6 w-6" /> {/* Increased size */}
              <span className="sr-only">Folder</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent/10 h-9 w-9">
              <CustomBellIcon className="h-6 w-6 text-accent" /> {/* Increased size and ensured accent color */}
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
