
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Filter, Users, Eye, Edit3, MessageCircle, CalendarPlus, Upload, MoreHorizontal, CheckSquare, Loader2 } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

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

interface Chat {
  id: string;
  contact?: string;
  lastMessage: string;
  timestamp: string;
  status: 'Unread' | 'Read' | 'Replied';
  unreadCount: number;
}

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().min(2, "Company must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"]),
  website: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Closed - Won" | "Closed - Lost";
  lastContact: string;
  website?: string;
}

const leadStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"] as const;

const initialLeadsData: Lead[] = [
  { id: 'L001', name: 'Sarah Miller', company: 'Innovate Solutions Ltd.', email: 'sarah.miller@example.com', status: 'New', lastContact: format(new Date(2024, 0, 15), "yyyy-MM-dd"), website: 'innovate.com' },
  { id: 'L002', name: 'John Davis', company: 'TechPro Services', email: 'john.davis@example.com', status: 'Contacted', lastContact: format(new Date(2024, 1, 20), "yyyy-MM-dd"), website: 'techpro.io' },
  { id: 'L003', name: 'Maria Garcia', company: 'GreenLeaf Organics', email: 'maria.garcia@example.com', status: 'Qualified', lastContact: format(new Date(2024, 2, 10), "yyyy-MM-dd") },
];

const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'default',
  'Contacted': 'secondary',
  'Qualified': 'outline',
  'Proposal Sent': 'default',
  'Closed - Won': 'default', // Will be styled green
  'Closed - Lost': 'destructive',
};


export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isViewLeadOpen, setIsViewLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoadingLeads(true);
    const storedLeads = localStorage.getItem(LOCAL_STORAGE_KEY_LEADS);
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      setLeads(initialLeadsData);
      localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(initialLeadsData));
    }
    setIsLoadingLeads(false);
  }, []);

  const saveLeadsToLocalStorage = (updatedLeads: Lead[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));
  };

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      status: "New",
      website: "",
    },
  });

  const editForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const handleAddLeadSubmit = async (values: LeadFormValues) => {
    const newLead: Lead = {
      id: `L${Date.now()}`,
      name: values.name,
      company: values.company,
      email: values.email,
      status: values.status,
      website: values.website,
      lastContact: format(new Date(), "yyyy-MM-dd"),
    };
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    saveLeadsToLocalStorage(updatedLeads);
    toast({ title: "Lead Added", description: `${values.name} has been added.` });
    form.reset();
    setIsAddLeadOpen(false);
  };

  const handleEditLeadSubmit = async (values: LeadFormValues) => {
    if (!selectedLead) return;
    const updatedLeads = leads.map(lead =>
      lead.id === selectedLead.id
        ? { ...selectedLead, ...values, lastContact: format(new Date(), "yyyy-MM-dd") }
        : lead
    );
    setLeads(updatedLeads);
    saveLeadsToLocalStorage(updatedLeads);
    toast({ title: "Lead Updated", description: `${values.name} has been updated.` });
    editForm.reset();
    setIsEditLeadOpen(false);
    setSelectedLead(null);
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: LeadFormValues['status']) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: format(new Date(), "yyyy-MM-dd") } : lead
    );
    setLeads(updatedLeads);
    saveLeadsToLocalStorage(updatedLeads);
    const leadName = leads.find(l => l.id === leadId)?.name || 'Lead';
    toast({ title: "Status Updated", description: `${leadName} status changed to ${newStatus}.` });
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    editForm.reset({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      status: lead.status,
      website: lead.website || "",
    });
    setIsEditLeadOpen(true);
  };

  const openViewModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewLeadOpen(true);
  };

  const handleStartChat = (lead: Lead) => {
    const storedChats = localStorage.getItem('chatsData'); // Assuming 'chatsData' from communications
    const currentChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const newChat: Chat = {
      id: `CHAT-${Date.now()}`,
      contact: `${lead.name} (${lead.company})`,
      lastMessage: 'Chat initiated...',
      timestamp: format(new Date(), "PPp"),
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
      dateTime: format(new Date(), 'PPp'),
      status: 'Scheduled',
      participants: ['You', lead.name],
      googleMeetLink: 'https://meet.google.com/new',
    };
    const updatedMeetings = [newMeeting, ...currentMeetings];
    localStorage.setItem('meetingsData', JSON.stringify(updatedMeetings));
    toast({ title: "Meeting Scheduled", description: `Meeting with ${lead.name} scheduled. Redirecting...` });
    router.push('/communications?tab=meetings');
  };

  const parseCSVToLeads = (csvText: string): Partial<Lead>[] => {
    const newLeadsFromCsv: Partial<Lead>[] = [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      toast({ title: "CSV Import Error", description: "CSV file is empty or has no data rows. It must have a header row and at least one data row.", variant: "destructive" });
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'company', 'email', 'status'];
    const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

    if (missingHeaders.length > 0) {
      toast({ title: "CSV Import Error", description: `Missing required columns: ${missingHeaders.join(', ')}. Expected: name, company, email, status. Optional: website, lastcontact (YYYY-MM-DD).`, variant: "destructive" });
      return [];
    }

    const nameIndex = headers.indexOf('name');
    const companyIndex = headers.indexOf('company');
    const emailIndex = headers.indexOf('email');
    const statusIndex = headers.indexOf('status');
    const websiteIndex = headers.indexOf('website');
    const lastContactIndex = headers.indexOf('lastcontact');

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
      const websiteValue = websiteIndex > -1 ? values[websiteIndex] : undefined;
      let lastContactValue = lastContactIndex > -1 ? values[lastContactIndex] : undefined;

      if (!name || !company || !email || !statusValue) {
          console.warn(`Skipping row ${i + 1} due to missing required data after parsing.`);
          continue;
      }

      try {
        if (lastContactValue && lastContactValue.trim() !== "") {
            lastContactValue = format(parseISO(lastContactValue), "yyyy-MM-dd");
        } else {
            lastContactValue = format(new Date(), "yyyy-MM-dd");
        }
      } catch (e) {
        console.warn(`Invalid date format for lastContact in row ${i+1}, defaulting to today.`);
        lastContactValue = format(new Date(), "yyyy-MM-dd");
      }

      const leadStatus = statusValue as LeadFormValues['status'];
      const isValidStatus = leadStatuses.includes(leadStatus);

      const lead: Partial<Lead> = {
        name: name,
        company: company,
        email: email,
        status: isValidStatus ? leadStatus : "New",
        website: websiteValue,
        lastContact: lastContactValue,
      };
      newLeadsFromCsv.push(lead);
    }
    return newLeadsFromCsv;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({ title: "Invalid File Type", description: "Please upload a .csv file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsedLeads = parseCSVToLeads(text);
        if (parsedLeads.length > 0) {
          const leadsToInsert = parsedLeads.map(p => ({
            id: `L${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Ensure unique ID
            name: p.name!,
            company: p.company!,
            email: p.email!,
            status: p.status!,
            website: p.website,
            lastContact: p.lastContact!,
          }));

          const updatedLeads = [...leads, ...leadsToInsert];
          setLeads(updatedLeads);
          saveLeadsToLocalStorage(updatedLeads);
          toast({ title: "Leads Imported", description: `${leadsToInsert.length} leads have been imported successfully.` });
        }
      } else {
          toast({ title: "File Error", description: "Could not read the file content.", variant: "destructive"});
      }
    };
    reader.onerror = () => {
      toast({ title: "File Read Error", description: "Failed to read the file.", variant: "destructive" });
    };
    reader.readAsText(file);

    if (event.target) event.target.value = "";
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const filteredLeads = useMemo(() => {
    if (statusFilter === "All") return leads;
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
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
                </Button>
              </DialogTrigger>
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
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., www.example.com" {...field} />
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
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                <div><strong className="font-medium">Email:</strong> <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">{selectedLead.email}</a></div>
                {selectedLead.website && <div><strong className="font-medium">Website:</strong> <a href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedLead.website}</a></div>}
                <div><strong className="font-medium">Status:</strong> <Badge variant={statusVariantMap[selectedLead.status] || 'default'}
                        className={
                          selectedLead.status === 'Qualified' ? 'bg-accent text-accent-foreground hover:bg-accent/90' :
                          selectedLead.status === 'Closed - Won' ? 'bg-green-500 text-white hover:bg-green-600' : ''
                        }>{selectedLead.status}</Badge></div>
                <div><strong className="font-medium">Last Contact:</strong> {selectedLead.lastContact ? format(parseISO(selectedLead.lastContact), "PP") : 'N/A'}</div>
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
            {isLoadingLeads ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Loading leads...</p>
                </div>
            ) : (
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
                    <TableCell>{lead.lastContact ? format(parseISO(lead.lastContact), "PP") : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Lead Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => openViewModal(lead)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(lead)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                  value={lead.status}
                                  onValueChange={(newStatus) => handleQuickStatusChange(lead.id, newStatus as LeadFormValues['status'])}
                                >
                                  {leadStatuses.map(status => (
                                    <DropdownMenuRadioItem key={status} value={status}>
                                      {status}
                                    </DropdownMenuRadioItem>
                                  ))}
                                </DropdownMenuRadioGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStartChat(lead)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Start Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleScheduleMeeting(lead)}>
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Schedule Meeting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
             {filteredLeads.length === 0 && !isLoadingLeads && (
              <div className="text-center py-10 text-muted-foreground">
                No leads match the current filter.
              </div>
            )}
          </CardContent>
        </Card>
        {/* AI Lead Finder Section Removed */}
      </div>
    </MainLayout>
  );
}
