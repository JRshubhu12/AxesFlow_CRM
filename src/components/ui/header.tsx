import { Button } from '@/components/ui/button';
import Image from 'next/image';
import UserNav from '@/components/layout/MainLayout';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageTitleDisplay from '@/components/layout/MainLayout';

export function MainHeader() {
  return (
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
          <Image src="/images/folder.png" alt="Folder" width={40} height={40} className="w-10 h-10" />
          <span className="sr-only">Folder</span>
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-accent/10 h-9 w-9">
          <Image src="/images/Notification.png" alt="Notifications" width={40} height={40} className="w-10 h-10" />
          <span className="sr-only">Notifications</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
