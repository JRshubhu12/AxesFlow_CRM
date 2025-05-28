
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/AppLogo';
import { navItems } from '@/config/nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { LogOut, UserCircle, Search, Folder, Bell, Settings } from 'lucide-react'; // Added Settings icon
import { Toaster } from '../ui/toaster';
import { cn } from '@/lib/utils'; // Added this import

const USER_PROFILE_STORAGE_KEY = 'userProfileData';

interface UserProfile {
  agencyName?: string;
  contactEmail?: string;
  agencyLogoUrl?: string;
}

function PageTitleDisplay() {
  const pathname = usePathname();
  const [title, setTitle] = useState('');

  useEffect(() => {
    const currentNavItem = navItems.find(item => item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
    
    if (pathname === '/profile') {
        setTitle('Profile');
    } else if (pathname === '/settings') {
        setTitle('Settings');
    } else if (pathname.startsWith('/projects/') && params && params.id) {
        setTitle(`Project Detail: ${params.id}`);
    } else if (currentNavItem) {
      setTitle(currentNavItem.title);
    } else {
      setTitle('Dashboard'); 
    }
  }, [pathname]);

  // This component relies on params for dynamic routes, which isn't directly available
  // in a layout component without passing it down or using a different context strategy.
  // For simplicity, if dynamic route details are needed, they should be handled within the page itself.
  // This PageTitleDisplay is simplified for now.
  const params = usePathname().split('/').filter(Boolean); // Basic attempt to get path parts

  return (
    <h1 className="text-xl font-semibold text-foreground">{title}</h1>
  );
}

function UserNav() {
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  useEffect(() => {
    const loadProfile = () => {
      const storedData = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedData) {
        try {
          const parsedData: UserProfile = JSON.parse(storedData);
          setUserProfile(parsedData);
        } catch (error) {
          console.error("Failed to parse user profile data from localStorage", error);
          setUserProfile({}); 
        }
      } else {
        setUserProfile({}); 
      }
    };
    
    loadProfile(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === USER_PROFILE_STORAGE_KEY) {
        loadProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'; 
    }
  };

  const getAvatarFallback = () => {
    if (userProfile.agencyName) {
      return userProfile.agencyName.substring(0, 2).toUpperCase();
    }
    return "ME";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src={userProfile.agencyLogoUrl || "https://placehold.co/40x40.png?text=U"} 
              alt={userProfile.agencyName || "User Avatar"} 
              data-ai-hint="agency logo user" 
            />
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile.agencyName || 'My Agency'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile.contactEmail || 'agency@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-sidebar-border h-16 flex items-center">
          <AppLogo /> 
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{content: item.tooltip}}
                  size="default"
                  className={cn(
                    "justify-start text-sm font-normal px-3 py-2 rounded-md",
                    (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-sidebar-foreground hover:bg-muted"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    {/* Icon removed based on design */}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* SidebarFooter removed as settings is now likely in UserNav or not shown per image */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-4"> 
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <PageTitleDisplay />
          </div>
          
          <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="search for features, settings and more"
                className="w-full rounded-full pl-10 pr-4 py-2 text-sm h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Files">
              <Folder className="h-5 w-5 text-muted-foreground" />
            </Button>
             <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen> {/* Ensure sidebar is open by default on desktop */}
      <LayoutContent>{children}</LayoutContent>
      <Toaster />
    </SidebarProvider>
  );
}
