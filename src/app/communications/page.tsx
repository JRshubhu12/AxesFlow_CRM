
export const dynamic = 'force-dynamic';
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, MessageCircle, FileText, Video, Phone, Users, Clock, MessageSquare, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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

// Updated Chat interface to align with Supabase and UI needs
export interface Chat {
  id: string; // Supabase ID (number) converted to string for React keys
  contact?: string; // Derived from lead_name or contact_name
  lastMessage: string;
  timestamp: string; // Formatted last_message_at
  status: 'Unread' | 'Read' | 'Replied';
  unreadCount: number;
  lead_id?: number; // Optional, if we want to link back to a lead
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
  { id: 'M001', title: 'Client Kick-off: Project Alpha', type: 'Video Call', dateTime: '2024-08-01 10:00 AM', status: 'Scheduled', participants: ['John D.', 'Sarah P.'], googleMeetLink: 'https://meet.google.com/abc-def-ghi' },
  { id: 'M002', title: 'Internal Strategy Session', type: 'In-Person', dateTime: '2024-07-28 02:00 PM', status: 'Completed', participants: ['Team A', 'Team B'] },
  { id: 'M003', title: 'Follow-up with Lead X', type: 'Phone Call', dateTime: '2024-08-05 11:30 AM', status: 'Pending Confirmation', participants: ['You', 'Lead X'] },
];

// initialChatsData will be removed as we fetch from Supabase

const initialFilesData: FileData[] = [
  { id: 'F001', name: 'Project Alpha Proposal.pdf', type: 'Document', size: '2.5 MB', uploaded: '2024-07-25', status: 'Shared' },
  { id: 'F002', name: 'Client Assets.zip', type: 'Archive', size: '50 MB', uploaded: '2024-07-20', status: 'Internal' },
  { id: 'F003', name: 'Meeting Notes - 2024-07-28.docx', type: 'Document', size: '120 KB', uploaded: '2024-07-28', status: 'Draft' },
];

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


function CommunicationsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'meetings');

  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const [chatsData, setChatsData] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]);

  useEffect(() => {
    // Load meetings from localStorage (remains localStorage for now)
    const storedMeetings = localStorage.getItem('meetingsData');
    setMeetingsData(storedMeetings ? JSON.parse(storedMeetings) : initialMeetingsData);

    // Load files from localStorage (remains localStorage for now)
    const storedFiles = localStorage.getItem('filesData');
    setFilesData(storedFiles ? JSON.parse(storedFiles) : initialFilesData);
  }, []);

  // Fetch chats from Supabase
  const fetchChats = async () => {
    setIsLoadingChats(true);
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching chats:', error);
      toast({ title: "Error Fetching Chats", description: error.message, variant: "destructive" });
      setChatsData([]);
    } else if (data) {
      const mappedChats: Chat[] = data.map(chat => ({
        id: chat.id.toString(),
        contact: chat.contact_name,
        lastMessage: chat.last_message || '',
        timestamp: chat.last_message_at ? format(parseISO(chat.last_message_at), "PPp") : 'N/A',
        status: chat.status as Chat['status'] || 'Read',
        unreadCount: chat.unread_count || 0,
        lead_id: chat.lead_id,
      }));
      setChatsData(mappedChats);
    }
    setIsLoadingChats(false);
  };
  
  useEffect(() => {
    if (activeTab === 'chats') {
      fetchChats();
    }
  }, [activeTab]);


  // Update localStorage when meetingsData changes (e.g., after an external update and redirect)
  useEffect(() => {
    localStorage.setItem('meetingsData', JSON.stringify(meetingsData));
  }, [meetingsData]);

  // Update localStorage when filesData changes
  useEffect(() => {
    localStorage.setItem('filesData', JSON.stringify(filesData));
  }, [filesData]);


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


  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><MessageSquare className="h-8 w-8 text-primary" /> Communication Hub</h1>
        <p className="text-muted-foreground">Organize your meetings, chats, and files in one place.</p>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="meetings"><CalendarDays className="mr-2 h-4 w-4" />Meetings</TabsTrigger>
            <TabsTrigger value="chats"><MessageCircle className="mr-2 h-4 w-4" />Chats</TabsTrigger>
            <TabsTrigger value="files"><FileText className="mr-2 h-4 w-4" />Files</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Upcoming & Past Meetings</CardTitle>
                <CardDescription>Keep track of all your scheduled and completed meetings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meetingsData.length === 0 && <p className="text-muted-foreground text-center py-4">No meetings found.</p>}
                {meetingsData.map(meeting => (
                  <Card key={meeting.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          {meeting.type === 'Video Call' && <Video className="mr-2 h-4 w-4" />}
                          {meeting.type === 'Phone Call' && <Phone className="mr-2 h-4 w-4" />}
                          {meeting.type === 'In-Person' && <Users className="mr-2 h-4 w-4" />}
                          {meeting.type} - <Clock className="ml-2 mr-1 h-4 w-4" /> {meeting.dateTime}
                        </p>
                        <p className="text-sm text-muted-foreground">Participants: {meeting.participants.join(', ')}</p>
                        {meeting.googleMeetLink && (
                           <p className="text-sm text-muted-foreground mt-1">
                            <Link href={meeting.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                              <LinkIcon className="mr-1 h-4 w-4" /> Join Meeting
                            </Link>
                          </p>
                        )}
                      </div>
                      <Badge variant={getStatusBadgeVariant(meeting.status)}
                       className={meeting.status === 'Pending Confirmation' || meeting.status === 'Unread' || meeting.status === 'Scheduled' ? 'bg-accent text-accent-foreground' : ''}
                      >{meeting.status}</Badge>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Chats</CardTitle>
                <CardDescription>Stay updated with your latest conversations from Supabase.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingChats ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Loading chats...</p>
                  </div>
                ) : chatsData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No chats found.</p>
                ) : (
                  chatsData.map(chat => (
                    <Card key={chat.id} className="p-4 hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{chat.contact || 'Chat'}</h3>
                            <p className="text-sm text-muted-foreground italic">&quot;{chat.lastMessage}&quot; - {chat.timestamp}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {chat.unreadCount > 0 && <Badge variant="destructive">{chat.unreadCount}</Badge>}
                            <Badge variant={getStatusBadgeVariant(chat.status)}
                             className={chat.status === 'Unread' ? 'bg-accent text-accent-foreground' : ''}
                            >{chat.status}</Badge>
                          </div>
                        </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Shared & Uploaded Files</CardTitle>
                <CardDescription>Access all your important documents and assets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {filesData.length === 0 && <p className="text-muted-foreground text-center py-4">No files found.</p>}
                {filesData.map(file => (
                  <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> {file.name}</h3>
                        <p className="text-sm text-muted-foreground">{file.type} - {file.size} - Uploaded: {file.uploaded}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(file.status)}
                       className={file.status === 'Pending Confirmation' || file.status === 'Unread' ? 'bg-accent text-accent-foreground' : ''}
                      >{file.status}</Badge>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

