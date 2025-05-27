
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users2, UserPlus, MessageSquarePlus } from 'lucide-react';
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

const initialTeamMembersData: TeamMember[] = [
  { id: 'T001', name: 'Alice Wonderland', role: 'Project Manager', email: 'alice@example.com', tasksAssigned: 5, avatar: 'https://placehold.co/40x40.png?text=AW', status: 'Active' },
  { id: 'T002', name: 'Bob The Builder', role: 'Lead Developer', email: 'bob@example.com', tasksAssigned: 8, avatar: 'https://placehold.co/40x40.png?text=BB', status: 'Active' },
  { id: 'T003', name: 'Carol Danvers', role: 'UX Designer', email: 'carol@example.com', tasksAssigned: 3, avatar: 'https://placehold.co/40x40.png?text=CD', status: 'Active' },
  { id: 'T004', name: 'Dave Lister', role: 'QA Tester', email: 'dave@example.com', tasksAssigned: 2, avatar: 'https://placehold.co/40x40.png?text=DL', status: 'Inactive' },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { toast } = useToast();

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
      avatar: `https://placehold.co/40x40.png?text=${values.name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
    };
    const updatedTeamMembers = [...teamMembers, newMember];
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
    toast({ title: "Team Member Added", description: `${newMember.name} has been added to the team.` });
    form.reset();
    setIsAddMemberOpen(false);
  };
  
  const handleAssignTask = (memberName: string) => {
    toast({ title: "Assign Task", description: `Opening task assignment for ${memberName}... (Feature coming soon)` });
  };

  const handleViewProfile = (memberName: string) => {
    toast({ title: "View Profile", description: `Displaying profile for ${memberName}... (Feature coming soon)` });
  };


  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Users2 className="h-8 w-8 text-primary" /> Team Members</h1>
            <p className="text-muted-foreground">Manage your agency&apos;s team and assign tasks.</p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new team member.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddMemberSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Alex Johnson" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="e.g., alex.j@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Member</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>View all team members and their current assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tasks Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person portrait"/>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-center">{member.tasksAssigned}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'Active' ? 'default' : 'destructive'} className={member.status === 'Active' ? 'bg-green-500 text-white hover:bg-green-600' : ''}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleAssignTask(member.name)}>
                        <MessageSquarePlus className="mr-1 h-3 w-3" /> Assign Task
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => handleViewProfile(member.name)}>View Profile</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
