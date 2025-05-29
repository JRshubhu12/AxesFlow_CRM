"use client";
export const dynamic = 'force-dynamic';

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, MessageCircle, FileText, Video, Phone, Users, Clock, MessageSquare as MessageSquareIcon, Link as LinkIcon, Loader2, Search, Download, Share2, MoreVertical } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Interfaces for data structures
interface Meeting {
  id: string;
  title: string;
  type: 'Video Call' | 'In-Person' | 'Phone Call';
  dateTime: string;
  status: 'Scheduled' | 'Completed' | 'Pending Confirmation' | 'Cancelled';
  participants: string[];
  googleMeetLink?: string;
}

export interface Chat {
  id: string;
  contact?: string;
  lastMessage: string;
  timestamp: string;
  status: 'Unread' | 'Read' | 'Replied';
  unreadCount: number;
  avatar?: string;
}

interface FileData {
  id: string;
  name: string;
  type: 'Document' | 'Archive' | 'Image' | string;
  size: string;
  uploaded: string;
  status: 'Shared' | 'Internal' | 'Draft';
}

const initialMeetingsData: Meeting[] = [
  { id: 'M001', title: 'Client Kick-off: Project Alpha', type: 'Video Call', dateTime: format(new Date(2024, 7, 1, 10, 0), "PPp"), status: 'Scheduled', participants: ['John D.', 'Sarah P.'], googleMeetLink: 'https://meet.google.com/abc-def-ghi' },
  { id: 'M002', title: 'Internal Strategy Session', type: 'In-Person', dateTime: format(new Date(2024, 6, 28, 14, 0), "PPp"), status: 'Completed', participants: ['Team A', 'Team B'] },
  { id: 'M003', title: 'Follow-up with Lead X', type: 'Phone Call', dateTime: format(new Date(2024, 7, 5, 11, 30), "PPp"), status: 'Pending Confirmation', participants: ['You', 'Lead X'] },
];

const initialChatsData: Chat[] = [
  { id: 'CHAT001', contact: 'Sarah Miller (Innovate Solutions Ltd.)', lastMessage: 'Can we schedule a call for next week?', timestamp: format(new Date(2024, 6, 28, 14, 30), "PPp"), status: 'Unread', unreadCount: 1, avatar: '/avatars/sarah.png' },
  { id: 'CHAT002', contact: 'John Davis (TechPro Services)', lastMessage: 'Thanks for the information!', timestamp: format(new Date(2024, 6, 27, 10, 0), "PPp"), status: 'Read', unreadCount: 0, avatar: '/avatars/john.png' },
  { id: 'CHAT003', contact: 'Internal Team Chat', lastMessage: 'Meeting notes are ready.', timestamp: format(new Date(2024, 6, 28, 11, 0), "PPp"), status: 'Read', unreadCount: 0, avatar: '/avatars/team.png' },
];

const initialFilesData: FileData[] = [
  { id: 'F001', name: 'Project Alpha Proposal.pdf', type: 'Document', size: '2.5 MB', uploaded: format(new Date(2024, 6, 25), "yyyy-MM-dd"), status: 'Shared' },
  { id: 'F002', name: 'Client Assets.zip', type: 'Archive', size: '50 MB', uploaded: format(new Date(2024, 6, 20), "yyyy-MM-dd"), status: 'Internal' },
  { id: 'F003', name: 'Meeting Notes - 2024-07-28.docx', type: 'Document', size: '120 KB', uploaded: format(new Date(2024, 6, 28), "yyyy-MM-dd"), status: 'Draft' },
];

const LOCAL_STORAGE_KEY_MEETINGS = 'meetingsData';
const LOCAL_STORAGE_KEY_CHATS = 'chatsData';
const LOCAL_STORAGE_KEY_FILES = 'filesData';

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'scheduled':
    case 'shared':
    case 'unread':
      return 'default';
    case 'completed':
    case 'read':
    case 'replied':
    case 'internal':
      return 'secondary';
    case 'pending confirmation':
    case 'draft':
    case 'cancelled':
      return 'outline';
    default:
      return 'default';
  }
};

const getFileIconColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'document':
      return 'text-blue-500';
    case 'archive':
      return 'text-purple-500';
    case 'image':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

function CommunicationsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'meetings');
  const [searchQuery, setSearchQuery] = useState('');

  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const [chatsData, setChatsData] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]);

  useEffect(() => {
    const storedMeetings = localStorage.getItem(LOCAL_STORAGE_KEY_MEETINGS);
    setMeetingsData(storedMeetings ? JSON.parse(storedMeetings) : initialMeetingsData);
    if (!storedMeetings) localStorage.setItem(LOCAL_STORAGE_KEY_MEETINGS, JSON.stringify(initialMeetingsData));

    const storedFiles = localStorage.getItem(LOCAL_STORAGE_KEY_FILES);
    setFilesData(storedFiles ? JSON.parse(storedFiles) : initialFilesData);
    if (!storedFiles) localStorage.setItem(LOCAL_STORAGE_KEY_FILES, JSON.stringify(initialFilesData));
  }, []);

  const fetchChatsFromLocalStorage = () => {
    setIsLoadingChats(true);
    const storedChats = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
    if (storedChats) {
      setChatsData(JSON.parse(storedChats));
    } else {
      setChatsData(initialChatsData);
      localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(initialChatsData));
    }
    setIsLoadingChats(false);
  };

  useEffect(() => {
    if (activeTab === 'chats') {
      fetchChatsFromLocalStorage();
    }
  }, [activeTab]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'meetings' || tabParam === 'chats' || tabParam === 'files')) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/communications?tab=${value}`, { scroll: false });
  };

  const filteredMeetings = meetingsData.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredChats = chatsData.filter(chat =>
    chat.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = filesData.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquareIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Communication Hub</h1>
              <p className="text-muted-foreground">Organize your meetings, chats, and files in one place</p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meetings" className="flex items-center gap-2 py-3">
              <CalendarDays className="h-4 w-4" />
              <span>Meetings</span>
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2 py-3">
              <MessageCircle className="h-4 w-4" />
              <span>Chats</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2 py-3">
              <FileText className="h-4 w-4" />
              <span>Files</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meetings">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Meetings</CardTitle>
                    <CardDescription>Upcoming and past meetings</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Schedule New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredMeetings.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No meetings found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMeetings.map(meeting => (
                      <div key={meeting.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              {meeting.type === 'Video Call' && (
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                  <Video className="h-5 w-5" />
                                </div>
                              )}
                              {meeting.type === 'Phone Call' && (
                                <div className="p-2 rounded-full bg-green-100 text-green-600">
                                  <Phone className="h-5 w-5" />
                                </div>
                              )}
                              {meeting.type === 'In-Person' && (
                                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                  <Users className="h-5 w-5" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold">{meeting.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{meeting.dateTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Participants:</span>
                              {meeting.participants.map((participant, i) => (
                                <Badge key={i} variant="outline" className="font-normal">
                                  {participant}
                                </Badge>
                              ))}
                            </div>
                            {meeting.googleMeetLink && (
                              <Link
                                href={meeting.googleMeetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline gap-1"
                              >
                                <LinkIcon className="h-4 w-4" />
                                Join Meeting
                              </Link>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={getStatusBadgeVariant(meeting.status)}
                              className={`capitalize ${
                                meeting.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                meeting.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                meeting.status === 'Pending Confirmation' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                'bg-red-100 text-red-800 hover:bg-red-100'
                              }`}
                            >
                              {meeting.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Chats</CardTitle>
                    <CardDescription>Recent conversations</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    New Chat
                  </Button>
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
          </TabsContent>

          <TabsContent value="files">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Files</CardTitle>
                    <CardDescription>Shared documents and assets</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredFiles.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No files found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredFiles.map(file => (
                      <div key={file.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${getFileIconColor(file.type)}/10`}>
                            <FileText className={`h-5 w-5 ${getFileIconColor(file.type)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold truncate">{file.name}</h3>
                              <Badge
                                variant={getStatusBadgeVariant(file.status)}
                                className="capitalize"
                              >
                                {file.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{file.type}</span>
                              <span>•</span>
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>Uploaded: {file.uploaded}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Rename</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default function CommunicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Communications Hub...</p>
        </div>
      </div>
    }>
      <CommunicationsPageContent />
    </Suspense>
  );
}