"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users2, UserPlus, MessageSquarePlus, Eye, MessageCircle, CalendarPlus, ChevronDown, MoreHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  status: z.enum(["Active", "Inactive"]),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export interface TeamMember extends TeamMemberFormValues {
  id: string;
  tasksAssigned: number;
  avatar: string;
}

interface Chat {
  id: string;
  contact?: string;
  title?: string;
  lastMessage: string;
  timestamp: string;
  status: 'Unread' | 'Read' | 'Replied';
  unreadCount: number;
}

interface Meeting {
  id: string;
  title: string;
  type: 'Video Call' | 'In-Person' | 'Phone Call';
  dateTime: string;
  status: 'Scheduled' | 'Completed' | 'Pending Confirmation' | 'Cancelled';
  participants: string[];
  googleMeetLink?: string;
}

const initialTeamMembersData: TeamMember[] = [
  { 
    id: 'T001', 
    name: 'Alice Wonderland', 
    role: 'Project Manager', 
    email: 'alice@example.com', 
    tasksAssigned: 5, 
    avatar: 'https://placehold.co/100x100.png?text=AW', 
    status: 'Active' 
  },
  { 
    id: 'T002', 
    name: 'Bob The Builder', 
    role: 'Lead Developer', 
    email: 'bob@example.com', 
    tasksAssigned: 8, 
    avatar: 'https://placehold.co/100x100.png?text=BB', 
    status: 'Active' 
  },
  { 
    id: 'T003', 
    name: 'Carol Danvers', 
    role: 'UX Designer', 
    email: 'carol@example.com', 
    tasksAssigned: 3, 
    avatar: 'https://placehold.co/100x100.png?text=CD', 
    status: 'Active' 
  },
  { 
    id: 'T004', 
    name: 'Dave Lister', 
    role: 'QA Tester', 
    email: 'dave@example.com', 
    tasksAssigned: 2, 
    avatar: 'https://placehold.co/100x100.png?text=DL', 
    status: 'Inactive' 
  },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isViewMemberOpen, setIsViewMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedTeamMembers = localStorage.getItem('teamMembers');
    if (storedTeamMembers) {
      setTeamMembers(JSON.parse(storedTeamMembers));
    } else {
      setTeamMembers(initialTeamMembersData);
      localStorage.setItem('teamMembers', JSON.stringify(initialTeamMembersData));
    }
  }, []);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      status: "Active",
    },
  });

  const handleAddMemberSubmit = (values: TeamMemberFormValues) => {
    const newMember: TeamMember = {
      ...values,
      id: `T${Date.now()}`,
      tasksAssigned: 0,
      avatar: `https://placehold.co/100x100.png?text=${values.name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
    };
    const updatedTeamMembers = [...teamMembers, newMember];
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
    toast({ 
      title: "Team Member Added", 
      description: `${newMember.name} has been added to the team.`,
      variant: "success"
    });
    form.reset();
    setIsAddMemberOpen(false);
  };

  const handleAssignTask = (memberName: string) => {
    toast({ 
      title: "Assign Task", 
      description: `Navigating to task assignment for ${memberName}...`,
      variant: "default"
    });
  };

  const openViewModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsViewMemberOpen(true);
  };

  const handleStartChat = (member: TeamMember) => {
    const storedChats = localStorage.getItem('chatsData');
    const currentChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const newChat: Chat = {
      id: `C-${Date.now()}`,
      contact: member.name,
      lastMessage: 'Chat initiated with team member...',
      timestamp: 'Just now',
      status: 'Unread',
      unreadCount: 1,
    };
    const updatedChats = [newChat, ...currentChats];
    localStorage.setItem('chatsData', JSON.stringify(updatedChats));
    toast({ 
      title: "Chat Initiated", 
      description: `Chat with ${member.name} started. Redirecting...`,
      variant: "success"
    });
    router.push('/communications?tab=chats');
  };

  const handleScheduleMeeting = (member: TeamMember) => {
    const storedMeetings = localStorage.getItem('meetingsData');
    const currentMeetings: Meeting[] = storedMeetings ? JSON.parse(storedMeetings) : [];
    const newMeeting: Meeting = {
      id: `M-${Date.now()}`,
      title: `Meeting with ${member.name}`,
      type: 'Video Call',
      dateTime: `Scheduled on ${format(new Date(), 'PPp')}`,
      status: 'Scheduled',
      participants: ['You', member.name],
      googleMeetLink: 'https://meet.google.com/new',
    };
    const updatedMeetings = [newMeeting, ...currentMeetings];
    localStorage.setItem('meetingsData', JSON.stringify(updatedMeetings));
    toast({ 
      title: "Meeting Scheduled", 
      description: `Meeting with ${member.name} scheduled. Redirecting...`,
      variant: "success"
    });
    router.push('/communications?tab=meetings');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users2 className="h-7 w-7 text-primary" /> 
              </div>
              <span>Team Management</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your team members, assign tasks, and coordinate collaboration
            </p>
          </div>
          
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 pl-5 pr-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                <UserPlus className="h-4 w-4" /> 
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Add New Team Member</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Complete the form to add a new member to your team
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddMemberSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Alex Johnson" 
                              className="py-5 px-4 rounded-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Role</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Software Engineer" 
                              className="py-5 px-4 rounded-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="e.g., alex.j@example.com" 
                              className="py-5 px-4 rounded-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="py-5 px-4 rounded-lg">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-lg">
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <div className="flex justify-end w-full gap-3">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setIsAddMemberOpen(false)}
                        className="px-6 rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="px-6 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                      >
                        Save Team Member
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* View Member Dialog */}
        <Dialog open={isViewMemberOpen} onOpenChange={setIsViewMemberOpen}>
          <DialogContent className="sm:max-w-xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Team Member Details</DialogTitle>
            </DialogHeader>
            
            {selectedMember && (
              <div className="space-y-6 py-2">
                <div className="flex items-center gap-5">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                      <AvatarFallback className="bg-primary/10">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                      <h3 className="text-2xl font-semibold">{selectedMember.name}</h3>
                      <p className="text-lg text-muted-foreground">{selectedMember.role}</p>
                      <Badge 
                        variant={selectedMember.status === 'Active' ? 'default' : 'destructive'} 
                        className={`px-3 py-1 text-sm ${selectedMember.status === 'Active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-red-100 text-red-800 hover:bg-red-100'}`}
                      >
                        {selectedMember.status}
                      </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-muted/20 p-5 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Member ID</p>
                    <p className="text-base font-medium">{selectedMember.id}</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base font-medium">{selectedMember.email}</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Tasks Assigned</p>
                    <p className="text-base font-medium">{selectedMember.tasksAssigned} tasks</p>
                  </div>
                  <div className="bg-muted/20 p-5 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-base font-medium">{selectedMember.status}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleStartChat(selectedMember)}
                    className="gap-2 px-5 rounded-lg"
                  >
                    <MessageCircle className="h-4 w-4" /> Message
                  </Button>
                  <Button 
                    className="gap-2 px-5 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    onClick={() => handleScheduleMeeting(selectedMember)}
                  >
                    <CalendarPlus className="h-4 w-4" /> Schedule Meeting
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="px-7 py-5 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl">Team Members</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'} in your team
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  <span className="text-sm">
                    {teamMembers.filter(m => m.status === 'Active').length} Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-gray-400"></span>
                  <span className="text-sm">
                    {teamMembers.filter(m => m.status === 'Inactive').length} Inactive
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[30%] pl-7">Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-7 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/10 border-b border-muted/20">
                    <TableCell className="pl-7">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-primary/10">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <p className="font-medium text-muted-foreground">{member.role}</p>
                    </TableCell>
                    
                    <TableCell>
                      <p className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                        {member.email}
                      </p>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="px-3 py-1 font-normal">
                        {member.tasksAssigned} {member.tasksAssigned === 1 ? 'task' : 'tasks'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`px-3 py-1 ${member.status === 'Active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}`}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="pr-7 text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="px-3 rounded-lg flex gap-1">
                              Actions <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-lg w-48">
                            <DropdownMenuItem 
                              onClick={() => openViewModal(member)}
                              className="cursor-pointer gap-2"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStartChat(member)}
                              className="cursor-pointer gap-2"
                            >
                              <MessageCircle className="h-4 w-4 text-muted-foreground" />
                              Message
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAssignTask(member.name)}
                              className="cursor-pointer gap-2"
                            >
                              <MessageSquarePlus className="h-4 w-4 text-muted-foreground" />
                              Assign Task
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleScheduleMeeting(member)}
                              className="cursor-pointer gap-2"
                            >
                              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                              Schedule Meeting
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {teamMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-5">
                  <Users2 className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No team members found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Get started by adding your first team member to collaborate on projects
                </p>
                <Button 
                  className="gap-2 pl-5 pr-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}