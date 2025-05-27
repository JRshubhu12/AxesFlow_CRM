
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
import { navItems, settingsNavItem } from '@/config/nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle } from 'lucide-react';
import { Toaster } from '../ui/toaster';

const USER_PROFILE_STORAGE_KEY = 'userProfileData';

interface UserProfile {
  agencyName?: string;
  contactEmail?: string;
  agencyLogoUrl?: string;
}

function AgencyNameDisplay() {
  const [agencyName, setAgencyName] = useState<string | null>(null);

  useEffect(() => {
    const loadAgencyName = () => {
      const storedData = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedData) {
        try {
          const parsedData: UserProfile = JSON.parse(storedData);
          setAgencyName(parsedData.agencyName || null);
        } catch (error) {
          console.error("Failed to parse agency name from localStorage", error);
          setAgencyName(null);
        }
      } else {
        setAgencyName(null);
      }
    };

    loadAgencyName(); // Initial load

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === USER_PROFILE_STORAGE_KEY) {
        loadAgencyName();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!agencyName) {
    return null; // Don't render anything if no agency name
  }

  return (
    <div className="hidden md:flex items-center mr-4">
      <span className="text-sm font-semibold text-foreground">{agencyName}</span>
    </div>
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
          setUserProfile({}); // Reset if parsing fails
        }
      } else {
        setUserProfile({}); // Reset if no data
      }
    };
    
    loadProfile(); // Initial load

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
              src={userProfile.agencyLogoUrl || "https://placehold.co/40x40.png?text=Logo"} 
              alt={userProfile.agencyName || "User Avatar"} 
              data-ai-hint="agency logo" 
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
        <SidebarHeader className="p-4">
          <AppLogo /> {/* This already shows "AxesFlow" */}
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{content: item.tooltip}}
                  variant="default"
                  size="default"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === settingsNavItem.href}
                  tooltip={{content: settingsNavItem.tooltip}}
                  variant="default"
                  size="default"
                >
                  <Link href={settingsNavItem.href} className="flex items-center gap-3">
                    <settingsNavItem.icon className="h-5 w-5" />
                    <span>{settingsNavItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 sm:px-6">
          <div className="flex items-center"> {/* Left group for mobile trigger and agency name */}
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <AgencyNameDisplay /> {/* Displays agency name, hidden on mobile by its own class */}
          </div>
          
          <div className="flex-1" /> {/* Spacer, pushes UserNav to the right */}

          <div className="flex items-center"> {/* Right group for UserNav */}
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <LayoutContent>{children}</LayoutContent>
      <Toaster />
    </SidebarProvider>
  );
}
