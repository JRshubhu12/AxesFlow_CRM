"use client";

import Link from 'next/link';
import { Search, ChevronDown, User, Settings, LogOut, DollarSign, Home, Users, Mail, MessageCircle, FolderKanban, CheckSquare, Users2, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AppLogo } from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
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
import Image from 'next/image';
import LoadingScreen from '@/components/ui/loading-screen';

// UserNav Component (avatar styled for round and border as in image)
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
    loadProfileData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userProfileData') {
        loadProfileData();
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
        <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 hover:bg-transparent">
          <Avatar className="h-11 w-11 rounded-full border-2 border-[#e0e0e0] shadow" style={{ boxShadow: '0 1px 6px 0 #eeeeee' }}>
            <AvatarImage src={agencyLogoUrl || "https://placehold.co/44x44.png?text=A"} alt={agencyName || "User"} />
            <AvatarFallback>{agencyName ? agencyName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-5 w-5 absolute right-[-10px] bottom-1 text-[#bababa]" />
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

// PageTitleDisplay Component (unchanged)
function PageTitleDisplay() {
  const pathname = usePathname();
  const [title, setTitle] = useState('');

  useEffect(() => {
    let pageTitle = "Dashboard";
    const findNavItem = (items: typeof appNavItems, currentPath: string): string | null => {
      for (const item of items) {
        if (item.subItems) {
          const subNavItemTitle = findNavItem(item.subItems, currentPath);
          if (subNavItemTitle && (currentPath === item.href || currentPath.startsWith(item.href + '/'))) return subNavItemTitle;
        }
        if (currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href + '/'))) {
          return item.title;
        }
      }
      return null;
    };
    const sortedNavItems = [...appNavItems].sort((a, b) => b.href.length - a.href.length);
    let navItemTitle = findNavItem(sortedNavItems, pathname);

    for (const item of sortedNavItems) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (pathname === subItem.href) {
            navItemTitle = subItem.title;
            break;
          }
        }
      }
      if (navItemTitle && (pathname === item.href || pathname.startsWith(item.href + '/'))) break;
    }

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
    } else if (pathname === '/') {
      pageTitle = 'Login';
    }

    setTitle(pageTitle);
  }, [pathname]);

  if (pathname === '/') return null;

  return <h1 className="text-xl font-semibold text-[#424242]">{title}</h1>;
}

// Custom Folder SVG Icon (bigger)
const CustomFolderIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path d="M9 3H4C2.89543 3 2 3.89543 2 5V8H22V7C22 5.89543 21.1046 5 20 5H11L9 3Z" fill="#4285F4"/>
    <path d="M2 8V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V8H2Z" fill="#73A9FF"/>
  </svg>
);

// Custom Bell SVG Icon (bigger)
const CustomBellIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none">
    <path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22ZM19.5 17.5C19.5 17.5 19 14.5 19 11C19 7.13401 15.866 4 12 4C8.13401 4 5 7.13401 5 11C5 14.5 4.5 17.5 4.5 17.5H19.5Z" fill="#4285F4"/>
  </svg>
);

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navItems = appNavItems;
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Map href to icon component
  const navIcons: Record<string, JSX.Element> = {
    '/dashboard': <Home className="mr-2 h-4 w-4" />,
    '/leads': <Users className="mr-2 h-4 w-4" />,
    '/email-campaigns': <Mail className="mr-2 h-4 w-4" />,
    '/communications': <MessageCircle className="mr-2 h-4 w-4" />,
    '/projects': <FolderKanban className="mr-2 h-4 w-4" />,
    '/tasks': <CheckSquare className="mr-2 h-4 w-4" />,
    '/team': <Users2 className="mr-2 h-4 w-4" />,
    '/finance': <DollarSign className="mr-2 h-4 w-4" />,
  };

  // --- SAMPLE DATA INJECTION FOR DEMO ---
  useEffect(() => {
    // Inject sample agency profile if not present
    if (!localStorage.getItem('userProfileData')) {
      localStorage.setItem('userProfileData', JSON.stringify({
        agencyName: 'Acme Digital',
        contactEmail: 'hello@acmedigital.com',
        agencyLogoUrl: 'https://placehold.co/44x44.png?text=AD',
      }));
    }
    // Inject sample notifications (if you have a notification system, add here)
    // Inject sample sidebar nav items if needed (handled by nav config)
  }, []);

  // Always call all hooks before any return!
  // Use conditional rendering inside the returned JSX
  return (
    <>
      {!hydrated ? (
        <LoadingScreen message="Loading page..." />
      ) : pathname === '/' ? (
        <>{children}</>
      ) : (
        <div className="flex min-h-screen bg-background">
          {/* Sidebar */}
          <div className={`border-r bg-sidebar-background p-0 sticky top-0 h-screen flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-60'}`}> 
            <div className={`mb-3 px-4 pt-5 pb-3 flex items-center transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''}`}> 
              <AppLogo />
            </div>
            <nav className={`space-y-1 px-3 overflow-y-auto flex-grow transition-all duration-300 ${sidebarCollapsed ? 'px-1' : 'px-3'}`}>
              {navItems.map((item) => {
                let isParentActive = pathname === item.href || pathname.startsWith(item.href + '/');
                if (item.href === '/dashboard' && pathname !== '/dashboard') {
                    isParentActive = false;
                }
                const isItemExactlyActive = pathname === item.href;
                const isActiveForStyling = isItemExactlyActive || (isParentActive && item.href !== '/dashboard' && item.href.length > 1);
                return (
                  <div key={item.title}>
                    <Link
                      href={item.href}
                      className={cn(
                        `group flex items-center rounded-md transition-all duration-300 text-sm ${sidebarCollapsed ? 'justify-center px-0 py-3 w-full' : 'px-3 py-2.5'}`,
                        isActiveForStyling
                          ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
                          : 'text-foreground font-normal hover:bg-muted hover:text-foreground'
                      )}
                      title={item.tooltip || item.title}
                    >
                      {navIcons[item.href] && (
                        <span className="flex items-center justify-center">{navIcons[item.href]}</span>
                      )}
                      {!sidebarCollapsed && <span className="ml-2">{item.title}</span>}
                    </Link>
                    {isParentActive && item.subItems && item.subItems.length > 0 && !sidebarCollapsed && (
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
            {/* Separator and User Links */}
            {!sidebarCollapsed && (
              <div className="px-3 pb-5">
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-3"></div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className={cn(
                      "group flex items-center px-3 py-2.5 rounded-md transition-colors text-sm",
                      pathname === '/profile'
                        ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
                        : 'text-foreground font-normal hover:bg-muted hover:text-foreground'
                    )}
                    title="Profile"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className={cn(
                      "group flex items-center px-3 py-2.5 rounded-md transition-colors text-sm",
                      pathname === '/settings'
                        ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
                        : 'text-foreground font-normal hover:bg-muted hover:text-foreground'
                    )}
                    title="Settings"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-auto">
            {/* Top Bar - matches the reference image, with bigger icons and styled avatar */}
            <header
              className="sticky top-0 z-10 flex h-[56px] items-center border-b bg-white px-8"
              style={{ boxShadow: 'none' }}
            >
              {/* Sidebar Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                className="mr-3"
                aria-label="Toggle sidebar"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
              >
                <Image src="/images/menu-collapse.svg" alt="Toggle sidebar" width={28} height={28} />
              </Button>
              {/* Left: Page Title */}
              <div className="flex items-center min-w-[180px] mr-5">
                <PageTitleDisplay />
              </div>

              {/* Center: Search Bar */}
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-lg">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a1a1a1]" />
                  <input
                    type="search"
                    placeholder="search for features, settings and more"
                    className="w-full h-[40px] pl-12 pr-4 rounded-full border border-[#bdbdbd] bg-transparent text-[15px] font-normal placeholder:text-[#8d8d8d] focus:outline-none focus:ring-2 focus:ring-primary transition"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-12">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8 ml-[-8px]">
                  <Image src="/images/folder.svg" alt="Folder" width={28} height={28} className="w-7 h-7" />
                  <span className="sr-only">Folder</span>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-accent/10 h-8 w-8">
                  <Image src="/images/Notification.svg" alt="Notifications" width={28} height={28} className="w-7 h-7" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <span className="absolute inset-0 rounded-full shadow-lg" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }} />
                      <Image src="/images/user.svg" alt="User" width={28} height={28} className="w-7 h-7 relative z-10" />
                      <span className="sr-only">User</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/')} className="cursor-pointer hover:bg-red-100 text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
