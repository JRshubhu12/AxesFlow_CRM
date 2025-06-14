"use client";
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Loader2, Search, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquareIcon } from 'lucide-react';

export interface Chat {
  id: string;
  contact?: string;
  lastMessage: string;
  timestamp: string;
  status: 'Unread' | 'Read' | 'Replied';
  unreadCount: number;
  avatar?: string;
}

const initialChatsData: Chat[] = [
  { id: 'CHAT001', contact: 'Sarah Miller (Innovate Solutions Ltd.)', lastMessage: 'Can we schedule a call for next week?', timestamp: 'Jul 28, 2024, 2:30 PM', status: 'Unread', unreadCount: 1, avatar: '/avatars/sarah.png' },
  { id: 'CHAT002', contact: 'John Davis (TechPro Services)', lastMessage: 'Thanks for the information!', timestamp: 'Jul 27, 2024, 10:00 AM', status: 'Read', unreadCount: 0, avatar: '/avatars/john.png' },
  { id: 'CHAT003', contact: 'Internal Team Chat', lastMessage: 'Meeting notes are ready.', timestamp: 'Jul 28, 2024, 11:00 AM', status: 'Read', unreadCount: 0, avatar: '/avatars/team.png' },
];

export default function ChatsPage() {
  const router = useRouter();
  const [chatsData, setChatsData] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoadingChats(true);
    const storedChats = localStorage.getItem('chatsData');
    if (storedChats) {
      setChatsData(JSON.parse(storedChats));
    } else {
      setChatsData(initialChatsData);
      localStorage.setItem('chatsData', JSON.stringify(initialChatsData));
    }
    setIsLoadingChats(false);
  }, []);

  const handleTabChange = (value: string) => {
    if (value === 'meetings') {
      // Go back to main communications page with meetings tab
      router.push('/communications?tab=meetings');
    } else {
      router.push('/communications/chats');
    }
  };

  const filteredChats = chatsData.filter(chat =>
    chat.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Communication Hub Heading and Description */}
        <div className="mb-2 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <MessageSquareIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Communication Hub</h1>
            <p className="text-muted-foreground">Organize your meetings and chats in one place</p>
          </div>
        </div>
        {/* Tabs Bar for switching between Meetings and Chats */}
        <Tabs value="chats" onValueChange={handleTabChange} className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meetings" className="flex items-center gap-2 py-3">
              <CalendarDays className="h-4 w-4" />
              <span>Meetings</span>
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2 py-3">
              <MessageCircle className="h-4 w-4" />
              <span>Chats</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
         
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Chats</CardTitle>
                <CardDescription>Recent conversations</CardDescription>
              </div>
              <button className="btn btn-outline gap-2 flex items-center">
                <MessageCircle className="h-4 w-4" />
                New Chat
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingChats ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading chats...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No chats found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredChats.map(chat => (
                  <div key={chat.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.contact?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold truncate">{chat.contact || 'Chat'}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {chat.timestamp}
                            </span>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}