
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Filter, Users, Eye, Edit3, MessageCircle, CalendarPlus, Sparkles, Search, Upload, MoreHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Removed DialogTrigger as it's part of DropdownMenu now
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { findLeads, type FindLeadsInput, type PotentialLead as AIGeneratedLead } from '@/ai/flows/find-leads-flow';


const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().min(2, "Company must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"]),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export interface Lead extends LeadFormValues {
  id: string;
  lastContact: string;
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


const initialLeadsData: Lead[] = [
  { id: 'L001', name: 'John Doe', company: 'Innovate Corp', email: 'john.doe@innovate.com', status: 'New', lastContact: '2024-07-20' },
  { id: 'L002', name: 'Jane Smith', company: 'Solutions Inc.', email: 'jane.smith@solutions.com', status: 'Contacted', lastContact: '2024-07-18' },
  { id: 'L003', name: 'Mike Brown', company: 'Tech Giants', email: 'mike.brown@techgiants.com', status: 'Qualified', lastContact: '2024-07-15' },
  { id: 'L004', name: 'Sarah Wilson', company: 'Future Forward', email: 'sarah.wilson@future.com', status: 'Proposal Sent', lastContact: '2024-07-10' },
  { id: 'L005', name: 'David Lee', company: 'Global Co', email: 'david.lee@global.co', status: 'Closed - Won', lastContact: '2024-07-01' },
];

const leadStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"] as const;


const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'default',
  'Contacted': 'secondary',
  'Qualified': 'outline',
  'Proposal Sent': 'default',
  'Closed - Won': 'default',
  'Closed - Lost': 'destructive',
};

// AI Lead Finder Form Schema
const aiLeadFinderSchema = z.object({
  industry: z.string().min(3, { message: "Target industry must be at least 3 characters." }),
  location: z.string().optional(),
  keywords: z.string().optional(),
});
type AILeadFinderFormValues = z.infer<typeof aiLeadFinderSchema>;


export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isViewLeadOpen, setIsViewLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiFoundLeads, setAiFoundLeads] = useState<AIGeneratedLead[]>([]);
  const [isAiFindingLeads, setIsAiFindingLeads] = useState(false);

  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      setLeads(initialLeadsData);
      localStorage.setItem('leads', JSON.stringify(initialLeadsData));
    }
  }, []);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      status: "New",
    },
  });

  const editForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const aiLeadFinderForm = useForm<AILeadFinderFormValues>({
    resolver: zodResolver(aiLeadFinderSchema),
    defaultValues: {
      industry: "",
      location: "",
      keywords: "",
    },
  });

  const handleAddLeadSubmit = (values: LeadFormValues) => {
    const newLead: Lead = {
      ...values,
      id: `L${Date.now()}`,
      lastContact: format(new Date(), "yyyy-MM-dd"),
    };
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    toast({ title: "Lead Added", description: `${newLead.name} has been added.` });
    form.reset();
    setIsAddLeadOpen(false);
  };

  const handleEditLeadSubmit = (values: LeadFormValues) => {
    if (!selectedLead) return;
    const updatedLeads = leads.map(lead =>
      lead.id === selectedLead.id ? { ...selectedLead, ...values, lastContact: format(new Date(), "yyyy-MM-dd") } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    toast({ title: "Lead Updated", description: `${values.name} has been updated.` });
    editForm.reset();
    setIsEditLeadOpen(false);
    setSelectedLead(null);
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    editForm.reset({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      status: lead.status,
    });
    setIsEditLeadOpen(true);
  };

  const openViewModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewLeadOpen(true);
  };

  const handleStartChat = (lead: Lead) => {
    const storedChats = localStorage.getItem('chatsData');
    const currentChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const newChat: Chat = {
      id: `C-${Date.now()}`,
      contact: `${lead.name} (${lead.company})`,
      lastMessage: 'Chat initiated...',
      timestamp: 'Just now',
      status: 'Unread',
      unreadCount: 1,
    };
    const updatedChats = [newChat, ...currentChats];
    localStorage.setItem('chatsData', JSON.stringify(updatedChats));
    toast({ title: "Chat Initiated", description: `Chat with ${lead.name} started. Redirecting...` });
    router.push('/communications?tab=chats');
  };

  const handleScheduleMeeting = (lead: Lead) => {
    const storedMeetings = localStorage.getItem('meetingsData');
    const currentMeetings: Meeting[] = storedMeetings ? JSON.parse(storedMeetings) : [];
    const newMeeting: Meeting = {
      id: `M-${Date.now()}`,
      title: `Meeting with ${lead.name}`,
      type: 'Video Call',
      dateTime: `Scheduled on ${format(new Date(), 'PPp')}`,
      status: 'Scheduled',
      participants: ['You', lead.name],
      googleMeetLink: 'https://meet.google.com/new',
    };
    const updatedMeetings = [newMeeting, ...currentMeetings];
    localStorage.setItem('meetingsData', JSON.stringify(updatedMeetings));
    toast({ title: "Meeting Scheduled", description: `Meeting with ${lead.name} scheduled. Redirecting...` });
    router.push('/communications?tab=meetings');
  };

  const handleAiFindLeads = async (values: AILeadFinderFormValues) => {
    setIsAiFindingLeads(true);
    setAiFoundLeads([]);
    try {
      const result = await findLeads(values);
      if (result.potentialLeads && result.potentialLeads.length > 0) {
        setAiFoundLeads(result.potentialLeads);
        toast({ title: "AI Leads Found!", description: `Found ${result.potentialLeads.length} potential leads.` });
      } else {
        setAiFoundLeads([]);
        toast({ title: "No Leads Found", description: "AI couldn't find leads matching your criteria. Try broadening your search." });
      }
    } catch (error: any) {
      console.error("Failed to find AI leads:", error);
      toast({
        title: "Error Finding Leads",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAiFindingLeads(false);
    }
  };
  
  const handleAddAiLeadToList = (aiLead: AIGeneratedLead) => {
    const newLead: Lead = {
      id: `L-AI-${Date.now()}`,
      name: aiLead.potentialContactTitle || aiLead.companyName, // Fallback to company name if title is missing
      company: aiLead.companyName,
      email: aiLead.contactEmail || `info@${aiLead.companyName.toLowerCase().replace(/\s+/g, '')}.com`, // Placeholder email if not found
      status: 'New',
      lastContact: format(new Date(), "yyyy-MM-dd"),
    };
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    toast({ title: "Lead Added", description: `${newLead.company} has been added to your leads list.` });
  };

  const parseCSVToLeads = (csvText: string): Lead[] => {
    const newLeads: Lead[] = [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      toast({ title: "CSV Import Error", description: "CSV file is empty or has no data rows. It must have a header row and at least one data row.", variant: "destructive" });
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'company', 'email', 'status'];
    const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

    if (missingHeaders.length > 0) {
      toast({ title: "CSV Import Error", description: `Missing required columns: ${missingHeaders.join(', ')}. Expected: name, company, email, status.`, variant: "destructive" });
      return [];
    }

    const nameIndex = headers.indexOf('name');
    const companyIndex = headers.indexOf('company');
    const emailIndex = headers.indexOf('email');
    const statusIndex = headers.indexOf('status');

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '')); 
      
      if (values.length < Math.max(nameIndex, companyIndex, emailIndex, statusIndex) + 1) {
          console.warn(`Skipping row ${i + 1} due to insufficient columns.`);
          continue;
      }
      
      const name = values[nameIndex];
      const company = values[companyIndex];
      const email = values[emailIndex];
      const statusValue = values[statusIndex];

      if (!name || !company || !email || !statusValue) {
          console.warn(`Skipping row ${i + 1} due to missing required data after parsing.`);
          continue; 
      }

      const leadStatus = statusValue as LeadFormValues['status'];
      const isValidStatus = leadStatuses.includes(leadStatus);

      const lead: Lead = {
        id: `L-CSV-${Date.now()}-${i}`,
        name: name,
        company: company,
        email: email,
        status: isValidStatus ? leadStatus : "New",
        lastContact: format(new Date(), "yyyy-MM-dd"),
      };
      newLeads.push(lead);
    }
    return newLeads;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({ title: "Invalid File Type", description: "Please upload a .csv file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsedLeads = parseCSVToLeads(text);
        if (parsedLeads.length > 0) {
          const updatedLeads = [...leads, ...parsedLeads];
          setLeads(updatedLeads);
          localStorage.setItem('leads', JSON.stringify(updatedLeads));
          toast({ title: "Leads Imported", description: `${parsedLeads.length} leads have been imported successfully.` });
        }
      } else {
          toast({ title: "File Error", description: "Could not read the file content.", variant: "destructive"});
      }
    };
    reader.onerror = () => {
      toast({ title: "File Read Error", description: "Failed to read the file.", variant: "destructive" });
    };
    reader.readAsText(file);

    if (event.target) {
      event.target.value = ""; 
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const filteredLeads = useMemo(() => {
    if (statusFilter === "All") {
      return leads;
    }
    return leads.filter(lead => lead.status === statusFilter);
  }, [leads, statusFilter]);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8 text-primary" /> Potential Leads</h1>
            <p className="text-muted-foreground">Manage and track your prospective clients.</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {leadStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-upload"
            />
            <Button onClick={handleImportClick} variant="outline" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" /> Import CSV
            </Button>
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <Button onClick={() => setIsAddLeadOpen(true)} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
              </Button>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new lead. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddLeadSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Innovate Corp" {...field} />
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
                            <Input type="email" placeholder="e.g., john.doe@example.com" {...field} />
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
                                <SelectValue placeholder="Select lead status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leadStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Save Lead</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Lead Dialog */}
        <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
              <DialogDescription>
                Update the details for {selectedLead?.name}. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditLeadSubmit)} className="space-y-4 py-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lead status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {leadStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditLeadOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Lead Dialog */}
        <Dialog open={isViewLeadOpen} onOpenChange={setIsViewLeadOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Lead Details</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="py-4 space-y-3">
                <div><strong className="font-medium">ID:</strong> {selectedLead.id}</div>
                <div><strong className="font-medium">Name:</strong> {selectedLead.name}</div>
                <div><strong className="font-medium">Company:</strong> {selectedLead.company}</div>
                <div><strong className="font-medium">Email:</strong> {selectedLead.email}</div>
                <div><strong className="font-medium">Status:</strong> <Badge variant={statusVariantMap[selectedLead.status] || 'default'}
                        className={
                          selectedLead.status === 'Qualified' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 
                          selectedLead.status === 'Closed - Won' ? 'bg-green-500 text-white hover:bg-green-600' : ''
                        }>{selectedLead.status}</Badge></div>
                <div><strong className="font-medium">Last Contact:</strong> {selectedLead.lastContact}</div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsViewLeadOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Leads List</CardTitle>
            <CardDescription>Browse through your current leads and their statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                        {lead.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariantMap[lead.status] || 'default'}
                        className={
                          lead.status === 'Qualified' ? 'bg-accent text-accent-foreground hover:bg-accent/90' :
                          lead.status === 'Closed - Won' ? 'bg-green-500 text-white hover:bg-green-600' : ''
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Lead Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStartChat(lead)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Start Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleScheduleMeeting(lead)}>
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Schedule Meeting
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openViewModal(lead)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(lead)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredLeads.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No leads match the current filter.
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Lead Finder Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" />AI Lead Finder</CardTitle>
            <CardDescription>Discover new potential leads using AI. Provide criteria below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...aiLeadFinderForm}>
              <form onSubmit={aiLeadFinderForm.handleSubmit(handleAiFindLeads)} className="space-y-6">
                <FormField
                  control={aiLeadFinderForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., E-commerce, FinTech, SaaS" {...field} />
                      </FormControl>
                      <FormDescription>The primary industry you are targeting.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={aiLeadFinderForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York, USA or Berlin, Germany" {...field} />
                      </FormControl>
                       <FormDescription>Specify a city, state, or country if desired.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={aiLeadFinderForm.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Keywords/Interests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., 'looking for CRM software', 'recently received funding', 'expanding into new markets'" {...field} rows={3}/>
                      </FormControl>
                      <FormDescription>Any other specific attributes or needs of the companies you're looking for.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full md:w-auto" disabled={isAiFindingLeads}>
                  {isAiFindingLeads ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Finding Leads...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" /> Find Leads with AI
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {isAiFindingLeads && (
              <div className="mt-6 flex flex-col items-center justify-center text-muted-foreground">
                <Sparkles className="h-10 w-10 text-primary animate-pulse mb-2" />
                <p>AI is searching for leads based on your criteria...</p>
              </div>
            )}

            {aiFoundLeads.length > 0 && !isAiFindingLeads && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Potential Leads Found:</h3>
                <div className="space-y-4">
                  {aiFoundLeads.map((lead, index) => (
                    <Card key={index} className="bg-muted/30 p-4 shadow-md">
                      <CardTitle className="text-lg">{lead.companyName}</CardTitle>
                      {lead.website && <CardDescription><a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{lead.website}</a></CardDescription>}
                      <CardContent className="pt-3 px-0 pb-0 space-y-2 text-sm">
                        {lead.potentialContactTitle && <p><strong className="font-medium">Contact Title:</strong> {lead.potentialContactTitle}</p>}
                        {lead.contactEmail && <p><strong className="font-medium">Email:</strong> <a href={`mailto:${lead.contactEmail}`} className="text-primary hover:underline">{lead.contactEmail}</a></p>}
                        {lead.contactPhone && <p><strong className="font-medium">Phone:</strong> {lead.contactPhone}</p>}
                        <p><strong className="font-medium">Reasoning:</strong> {lead.reasoning}</p>
                        {lead.estimatedCompanySize && <p><strong className="font-medium">Est. Size:</strong> {lead.estimatedCompanySize}</p>}
                        {lead.keyProductOrService && <p><strong className="font-medium">Key Offering:</strong> {lead.keyProductOrService}</p>}
                         <Button size="sm" variant="outline" className="mt-2" onClick={() => handleAddAiLeadToList(lead)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add to My Leads
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {!aiFoundLeads.length && !isAiFindingLeads && aiLeadFinderForm.formState.isSubmitted && (
                 <div className="mt-6 text-center text-muted-foreground">
                    No potential leads found for the given criteria. Try adjusting your search.
                </div>
            )}

          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}


    