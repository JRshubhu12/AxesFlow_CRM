
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Users,
  PlusCircle,
  Filter as FilterIcon, // Renamed to avoid conflict
  Eye,
  Edit3,
  MessageCircle,
  CalendarPlus,
  Upload,
  MoreHorizontal,
  CheckSquare,
  Loader2,
  ListFilter,
  RefreshCw,
  Briefcase,
  MapPin,
  Building,
  Users2 as UsersIcon, // For employee count
  DollarSign,
  Search as SearchIcon, // For keyword filter
  GraduationCap,
  Cpu,
  Info,
  Link as LinkIcon, // For LinkedIn URL
  Lightbulb, // For Skills
  Building2 as DepartmentIcon, // For Department
  Download,
  ListPlus,
  Linkedin
} from 'lucide-react';
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
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  title: z.string().optional(),
  phone: z.string().optional(),
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
  title?: string; 
  phone?: string; 
  avatar?: string; 
}

const leadStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"] as const;

const initialLeadsData: Lead[] = [
  { id: 'L001', name: 'Ronald Richards', company: 'Aster Medical', email: 'ronaldrichards@gmail.com', status: 'New', lastContact: format(new Date(2024, 0, 15), "yyyy-MM-dd"), website: 'innovate.com', title: 'Founder & CEO', phone: '(219) 555-0114', avatar: 'https://placehold.co/40x40.png?text=RR' },
  { id: 'L002', name: 'Courtney Henry', company: 'Big Kahuna Burger Ltd.', email: 'courtneyhenry@gmail.com', status: 'Contacted', lastContact: format(new Date(2024, 1, 20), "yyyy-MM-dd"), website: 'techpro.io', title: 'CEO', phone: '(907) 555-0101', avatar: 'https://placehold.co/40x40.png?text=CH' },
  { id: 'L003', name: 'Annette Black', company: 'Astra Payroll Services', email: 'annetteblacke@gmail.com', status: 'Qualified', lastContact: format(new Date(2024, 2, 10), "yyyy-MM-dd"), title: 'Founder & CEO', phone: '(225) 555-0118', avatar: 'https://placehold.co/40x40.png?text=AB' },
  { id: 'L004', name: 'Cameron Williamson', company: 'Commonwealth Payroll', email: 'cameron@gmail.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 3, 5), "yyyy-MM-dd"), title: 'Founder & CEO', phone: '(406) 555-0120', avatar: 'https://placehold.co/40x40.png?text=CW' },
  { id: 'L005', name: 'Brooklyn Simmons', company: 'Acme Co.', email: 'brooklynsimmons@gmail.com', status: 'New', lastContact: format(new Date(2024, 4, 12), "yyyy-MM-dd"), title: 'CEO', phone: '(702) 555-0122', avatar: 'https://placehold.co/40x40.png?text=BS' },
];

const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';
const LOCAL_STORAGE_KEY_CHATS = 'chatsData'; // For initiating chats
const LOCAL_STORAGE_KEY_MEETINGS = 'meetingsData'; // For scheduling meetings


const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'default',
  'Contacted': 'secondary',
  'Qualified': 'outline',
  'Proposal Sent': 'default',
  'Closed - Won': 'default', 
  'Closed - Lost': 'destructive',
};


const filterSections = [
  { id: 'name', label: 'Name', icon: UsersIcon, placeholder: 'Search by name...' },
  { id: 'title', label: 'Title', icon: Briefcase, placeholder: 'e.g., CEO, Founder' },
  { id: 'location', label: 'Location', icon: MapPin, placeholder: 'e.g., New York, Remote' },
  { id: 'industry', label: 'Industry', icon: Building, placeholder: 'Select industry' },
  { id: 'employeeCount', label: 'Employee Count', icon: UsersIcon, placeholder: 'e.g., 0-25, 25-100' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, placeholder: 'e.g., $1M - $10M' },
  { id: 'keywordFilter', label: 'Keyword Filter', icon: SearchIcon, placeholder: 'Enter keywords...' },
  { id: 'education', label: 'Education', icon: GraduationCap, placeholder: 'e.g., CSE, MSC' },
  { id: 'technology', label: 'Technology', icon: Cpu, placeholder: 'e.g., Salesforce, HubSpot' },
  { id: 'contactInfo', label: 'Contact Info', icon: Info, placeholder: 'Email, Phone...' },
  { id: 'linkedinUrl', label: 'LinkedIn URL or Twitter', icon: LinkIcon, placeholder: 'Enter URL...' },
  { id: 'skills', label: 'Skills', icon: Lightbulb, placeholder: 'e.g., Marketing, Sales' },
  { id: 'department', label: 'Department', icon: DepartmentIcon, placeholder: 'e.g., Sales, Marketing' },
];


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
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

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
      title: "",
      phone: "",
    },
  });

  const editForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const handleAddLeadSubmit = async (values: LeadFormValues) => {
    const newLead: Lead = {
      id: `L${Date.now()}`,
      ...values,
      lastContact: format(new Date(), "yyyy-MM-dd"),
      avatar: `https://placehold.co/40x40.png?text=${values.name.split(' ').map(n=>n[0]).join('').toUpperCase()}`
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
    const updatedLead: Lead = {
      ...selectedLead,
      ...values,
    };
    const updatedLeads = leads.map(lead => lead.id === selectedLead.id ? updatedLead : lead);
    setLeads(updatedLeads);
    saveLeadsToLocalStorage(updatedLeads);
    toast({ title: "Lead Updated", description: `${values.name} has been updated.` });
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
        website: lead.website || "",
        title: lead.title || "",
        phone: lead.phone || "",
    });
    setIsEditLeadOpen(true);
  };

  const openViewModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewLeadOpen(true);
  };
  
  const handleChangeStatus = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: format(new Date(), "yyyy-MM-dd") } : lead
    );
    setLeads(updatedLeads);
    saveLeadsToLocalStorage(updatedLeads);
    toast({ title: "Status Updated", description: `Lead status changed to ${newStatus}.` });
  };

  const handleStartChat = (lead: Lead) => {
    const storedChats = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
    const currentChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const newChat: Chat = {
      id: `C-${Date.now()}`,
      contact: `${lead.name} (${lead.company})`,
      lastMessage: 'Chat initiated with lead...',
      timestamp: format(new Date(), "PPpp"),
      status: 'Unread',
      unreadCount: 1,
    };
    const updatedChats = [newChat, ...currentChats];
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(updatedChats));
    toast({ title: "Chat Initiated", description: `Chat with ${lead.name} started. Redirecting...` });
    router.push('/communications?tab=chats');
  };

  const handleScheduleMeeting = (lead: Lead) => {
    const storedMeetings = localStorage.getItem(LOCAL_STORAGE_KEY_MEETINGS);
    const currentMeetings: Meeting[] = storedMeetings ? JSON.parse(storedMeetings) : [];
    const newMeeting: Meeting = {
      id: `M-${Date.now()}`,
      title: `Meeting with ${lead.name} (${lead.company})`,
      type: 'Video Call',
      dateTime: format(new Date(new Date().setDate(new Date().getDate() + 1)), "PPpp"), // Default to next day
      status: 'Scheduled',
      participants: ['You', lead.name],
      googleMeetLink: 'https://meet.google.com/new', // Placeholder
    };
    const updatedMeetings = [newMeeting, ...currentMeetings];
    localStorage.setItem(LOCAL_STORAGE_KEY_MEETINGS, JSON.stringify(updatedMeetings));
    toast({ title: "Meeting Scheduled", description: `Meeting with ${lead.name} scheduled. Redirecting...` });
    router.push('/communications?tab=meetings');
  };

  // Placeholder functions for new actions
  const handleDownloadCSV = () => toast({ title: "Download CSV", description: "Functionality to download CSV coming soon!" });
  const handleAddToCampaign = () => toast({ title: "Add to Campaign", description: "Functionality to add to campaign coming soon!" });


  const parseCSVToLeads = (csvText: string): Partial<Lead>[] => {
    const newLeadsFromCsv: Partial<Lead>[] = [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      toast({ title: "CSV Import Error", description: "CSV file is empty or has no data rows. It must have a header row and at least one data row.", variant: "destructive" });
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'company', 'email']; // Status is optional in CSV, defaults to New
    const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

    if (missingHeaders.length > 0) {
      toast({ title: "CSV Import Error", description: `Missing required columns: ${missingHeaders.join(', ')}. Expected at least: name, company, email. Optional: status, website, title, phone.`, variant: "destructive" });
      return [];
    }

    const nameIndex = headers.indexOf('name');
    const companyIndex = headers.indexOf('company');
    const emailIndex = headers.indexOf('email');
    const statusIndex = headers.indexOf('status');
    const websiteIndex = headers.indexOf('website');
    const titleIndex = headers.indexOf('title');
    const phoneIndex = headers.indexOf('phone');
    // lastContact can be defaulted or parsed if provided

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

      if (values.length < Math.max(nameIndex, companyIndex, emailIndex) + 1) {
          console.warn(`Skipping row ${i + 1} due to insufficient columns for required fields.`);
          continue;
      }

      const name = values[nameIndex];
      const company = values[companyIndex];
      const email = values[emailIndex];
      
      if (!name || !company || !email) {
          console.warn(`Skipping row ${i + 1} due to missing required data (name, company, or email).`);
          continue;
      }
      
      const statusValue = statusIndex > -1 ? values[statusIndex] : "New";
      const websiteValue = websiteIndex > -1 ? values[websiteIndex] : undefined;
      const titleValue = titleIndex > -1 ? values[titleIndex] : undefined;
      const phoneValue = phoneIndex > -1 ? values[phoneIndex] : undefined;
      
      const leadStatus = leadStatuses.includes(statusValue as Lead['status']) ? statusValue as Lead['status'] : "New";

      const lead: Partial<Lead> = {
        name,
        company,
        email,
        status: leadStatus,
        website: websiteValue,
        title: titleValue,
        phone: phoneValue,
        lastContact: format(new Date(), "yyyy-MM-dd"), // Default last contact to today for CSV imports
        avatar: `https://placehold.co/40x40.png?text=${name.split(' ').map(n=>n[0]).join('').toUpperCase()}`
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
            id: `L${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: p.name!,
            company: p.company!,
            email: p.email!,
            status: p.status!,
            website: p.website,
            title: p.title,
            phone: p.phone,
            lastContact: p.lastContact!,
            avatar: p.avatar!,
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
  
  const handleSelectRow = (leadId: string, checked: boolean) => {
    setSelectedRows(prev => ({ ...prev, [leadId]: checked }));
  };

  const filteredLeads = useMemo(() => {
    if (statusFilter === "All") {
      return leads;
    }
    return leads.filter(lead => lead.status === statusFilter);
  }, [leads, statusFilter]);

  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every(lead => selectedRows[lead.id]);

  const handleSelectAllRows = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    if (checked) {
      filteredLeads.forEach(lead => newSelectedRows[lead.id] = true);
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <Tabs defaultValue="people" className="flex-grow flex flex-col">
          <div className="px-6 pt-4 pb-2 border-b">
            <TabsList className="grid w-full grid-cols-2 md:w-[240px] bg-muted">
              <TabsTrigger value="people" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">People</TabsTrigger>
              <TabsTrigger value="companies" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Companies</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="people" className="flex-grow flex overflow-hidden">
            {/* Filters Sidebar */}
            <ScrollArea className="w-72 border-r bg-card p-4 hidden md:block">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Save Filters", description: "Functionality coming soon!"})}>
                      <ListFilter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Reset Filters", description: "Functionality coming soon!"})}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {filterSections.map(section => (
                  <div key={section.id} className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <section.icon className="h-4 w-4" />
                      {section.label}
                    </Label>
                    {section.id === 'status' ? (
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                {leadStatuses.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input placeholder={section.placeholder} className="h-9"/>
                    )}
                    {(section.id === 'title' || section.id === 'location' || section.id === 'employeeCount' || section.id === 'revenue' || section.id === 'education') && (
                       <div className="flex flex-wrap gap-1 mt-1">
                         {section.id === 'title' && <>
                            <Badge variant="secondary" className="text-xs">Founder <button className="ml-1 text-muted-foreground hover:text-foreground">x</button></Badge>
                            <Badge variant="secondary" className="text-xs">CEO <button className="ml-1 text-muted-foreground hover:text-foreground">x</button></Badge>
                         </>}
                          {section.id === 'location' && <>
                            <Badge variant="secondary" className="text-xs">New York <button className="ml-1 text-muted-foreground hover:text-foreground">x</button></Badge>
                         </>}
                       </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Clear Filters", description: "Filters cleared (placeholder)!"})}>Clear ({/* Placeholder count */}11)</Button>
                  <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={() => toast({ title: "Apply Filters", description: "Filters applied (placeholder)!"})}>Apply Filter</Button>
                </div>
              </div>
            </ScrollArea>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-4 gap-2">
                <h1 className="text-2xl font-semibold text-foreground invisible md:visible">People</h1> {/* Hidden on mobile, MainLayout shows page title */}
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="csv-upload"
                  />
                   <Button variant="outline" onClick={handleImportClick}> 
                    <Upload className="mr-2 h-4 w-4" /> Import CSV 
                  </Button>
                  <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <ListPlus className="mr-2 h-4 w-4" /> Add to List
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
                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., CEO" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="company" render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Innovate Corp" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="e.g., (123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input placeholder="e.g., https://www.example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select lead status" /></SelectTrigger></FormControl><SelectContent>{leadStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <DialogFooter><Button type="submit">Save Lead</Button></DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                  </Dialog>
                  <Button onClick={handleAddToCampaign}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add to Campaign
                  </Button>
                </div>
              </div>

              {isLoadingLeads ? (
                <div className="flex-1 flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden shadow">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px] px-4">
                           <Checkbox 
                             checked={isAllSelected}
                             onCheckedChange={(checked) => handleSelectAllRows(Boolean(checked))}
                           />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone Numbers</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-muted/50" data-state={selectedRows[lead.id] ? 'selected' : ''}>
                          <TableCell className="px-4">
                            <Checkbox 
                              checked={selectedRows[lead.id] || false}
                              onCheckedChange={(checked) => handleSelectRow(lead.id, Boolean(checked))}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={lead.avatar || `https://placehold.co/40x40.png?text=${lead.name.split(' ').map(n=>n[0]).join('').toUpperCase()}`} alt={lead.name} data-ai-hint="person avatar" />
                                <AvatarFallback>{lead.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{lead.name}</span>
                              <Linkedin className="h-4 w-4 text-blue-600 cursor-pointer" onClick={() => window.open('https://linkedin.com', '_blank')} />
                            </div>
                          </TableCell>
                          <TableCell>{lead.title || 'N/A'}</TableCell>
                          <TableCell>{lead.company}</TableCell>
                          <TableCell>
                            <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell>{lead.phone || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Actions</span>
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
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <CheckSquare className="mr-2 h-4 w-4" />
                                                Change Status
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuRadioGroup 
                                                        value={lead.status} 
                                                        onValueChange={(newStatus) => handleChangeStatus(lead.id, newStatus as Lead['status'])}
                                                    >
                                                        {leadStatuses.map((status) => (
                                                            <DropdownMenuRadioItem key={status} value={status}>
                                                                {status}
                                                            </DropdownMenuRadioItem>
                                                        ))}
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {filteredLeads.length === 0 && !isLoadingLeads && (
                <div className="flex-1 flex justify-center items-center text-muted-foreground">
                  No leads found.
                </div>
              )}
               <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[180px] h-9">
                       Rows per page: <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>Pages 1 of {Math.ceil(filteredLeads.length / 10)} pages</div> {/* Placeholder pagination */}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="companies" className="flex-grow p-6">
            <Card>
              <CardHeader>
                <CardTitle>Companies</CardTitle>
                <CardDescription>Company-centric lead view coming soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This section will display leads grouped by companies.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Lead Dialog (now "Add to List") */}
         <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            {/* DialogTrigger is handled by the "Add to List" button */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new lead. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddLeadSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., CEO" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="company" render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Innovate Corp" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="e.g., (123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input placeholder="e.g., https://www.example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select lead status" /></SelectTrigger></FormControl><SelectContent>{leadStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <DialogFooter><Button type="submit">Save Lead</Button></DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        {/* Edit Lead Dialog */}
        <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                    <DialogDescription>
                        Update the lead's details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(handleEditLeadSubmit)} className="space-y-4 py-4">
                        <FormField control={editForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={editForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={editForm.control} name="company" render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={editForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={editForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={editForm.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={editForm.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select lead status" /></SelectTrigger></FormControl><SelectContent>{leadStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <DialogFooter><Button type="submit">Save Changes</Button></DialogFooter>
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
                    <div className="py-4 space-y-2">
                        <p><strong>Name:</strong> {selectedLead.name}</p>
                        <p><strong>Title:</strong> {selectedLead.title || 'N/A'}</p>
                        <p><strong>Company:</strong> {selectedLead.company}</p>
                        <p><strong>Email:</strong> <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">{selectedLead.email}</a></p>
                        <p><strong>Phone:</strong> {selectedLead.phone || 'N/A'}</p>
                        <p><strong>Website:</strong> {selectedLead.website ? <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedLead.website}</a> : 'N/A'}</p>
                        <p><strong>Status:</strong> <Badge variant={statusVariantMap[selectedLead.status]}>{selectedLead.status}</Badge></p>
                        <p><strong>Last Contact:</strong> {format(parseISO(selectedLead.lastContact), "PPP")}</p>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsViewLeadOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
}


    