
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  PlusCircle,
  Download,
  Plus,
  Linkedin,
  MoreVertical,
  MessageCircle,
  CalendarPlus,
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  Search,
  User,
  Briefcase,
  MapPin,
  Building2,
  Users as UsersIcon,
  DollarSign,
  Filter as FilterIcon, // Renamed to avoid conflict with .filter array method
  Bookmark,
  X,
  Sparkles, // For AI features
  Loader2, // For loading states
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
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
import { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Added Card components
import { findLeads, type FindLeadsInput, type FoundLead } from '@/ai/flows/find-leads-flow';


// Schema and types
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().min(2, "Company must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"]),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  title: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  linkedin_url: z.string().url({ message: "Please enter a valid LinkedIn URL."}).optional().or(z.literal('')),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Closed - Won" | "Closed - Lost";
  lastContact: string; // ISO string
  website?: string;
  title?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  industry?: string;
  linkedin_url?: string;
}

const leadStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"] as const;

const initialLeadsData: Lead[] = [
    { id: 'L001', name: 'Ronald Richards', company: 'Astor Medical', email: 'darrellsteward@gmail.com', status: 'New', lastContact: '2024-05-20T10:00:00Z', title: 'Founder & CEO', phone: '(202) 555-0121', avatar: 'https://placehold.co/40x40.png?text=RR', location: 'New York, NY', industry: 'Healthcare', website: 'https://astormedical.com', linkedin_url: 'https://linkedin.com/in/ronaldrichards' },
    { id: 'L002', name: 'Courtney Henry', company: 'Big Kahuna Burger Ltd.', email: 'marvinmckinney@gmail.com', status: 'Contacted', lastContact: '2024-05-22T11:30:00Z', title: 'CEO', phone: '(308) 555-0111', avatar: 'https://placehold.co/40x40.png?text=CH', location: 'Los Angeles, CA', industry: 'Food & Beverage', website: 'https://bigkahunaburger.com', linkedin_url: 'https://linkedin.com/in/courtneyhenry' },
    { id: 'L003', name: 'Annette Black', company: 'Astra Payroll Services', email: 'ralphralphsw@gmail.com', status: 'Qualified', lastContact: '2024-05-15T14:00:00Z', title: 'Founder & CEO', phone: '(620) 555-0128', avatar: 'https://placehold.co/40x40.png?text=AB', location: 'Chicago, IL', industry: 'Financial Services', website: 'https://astrapayroll.com', linkedin_url: 'https://linkedin.com/in/annetteblack' },
    { id: 'L004', name: 'Cameron Williamson', company: 'Commonwealth Payroll', email: 'janecooper@gmail.com', status: 'Proposal Sent', lastContact: '2024-05-10T09:00:00Z', title: 'Founder & CEO', phone: '(252) 555-0153', avatar: 'https://placehold.co/40x40.png?text=CW', location: 'Boston, MA', industry: 'Financial Services', website: 'https://commonwealthpayroll.com', linkedin_url: 'https://linkedin.com/in/cameronwilliamson' },
    { id: 'L005', name: 'Brooklyn Simmons', company: 'Acme Co.', email: 'clevecleme@gmail.com', status: 'Closed - Won', lastContact: '2024-04-28T16:00:00Z', title: 'CEO', phone: '(208) 555-0106', avatar: 'https://placehold.co/40x40.png?text=BS', location: 'Austin, TX', industry: 'Technology', website: 'https://acmeco.com', linkedin_url: 'https://linkedin.com/in/brooklynsimmons' },
    // ... Add more leads up to ~50 ...
    { id: 'L006', name: 'Eleanor Pena', company: 'SoftLayer, an IBM Company', email: 'wadebwarre@gmail.com', status: 'New', lastContact: '2024-05-25T10:00:00Z', title: 'CTO', phone: '(270) 555-0117', avatar: 'https://placehold.co/40x40.png?text=EP', location: 'Dallas, TX', industry: 'Cloud Computing', website: 'https://softlayer.com', linkedin_url: 'https://linkedin.com/in/eleanorpena' },
    { id: 'L007', name: 'Theresa Webb', company: 'Binford Ltd.', email: 'floyedmiled@gmail.com', status: 'Contacted', lastContact: '2024-05-24T11:30:00Z', title: 'Marketing Director', phone: '(239) 555-0108', avatar: 'https://placehold.co/40x40.png?text=TW', location: 'Detroit, MI', industry: 'Manufacturing', website: 'https://binford.com', linkedin_url: 'https://linkedin.com/in/theresawebb' },
    { id: 'L008', name: 'Kathryn Murphy', company: 'Wells Fargo Advisors', email: 'diannerussue@gmail.com', status: 'Qualified', lastContact: '2024-05-23T14:00:00Z', title: 'Financial Advisor', phone: '(207) 555-0112', avatar: 'https://placehold.co/40x40.png?text=KM', location: 'San Francisco, CA', industry: 'Banking', website: 'https://wellsfargoadvisors.com', linkedin_url: 'https://linkedin.com/in/kathrynmurphy' },
    { id: 'L009', name: 'Darrell Steward', company: 'Innovatech Solutions', email: 'lesliealexander@gmail.com', status: 'Proposal Sent', lastContact: '2024-05-22T09:00:00Z', title: 'Sales Manager', phone: '(303) 555-0121', avatar: 'https://placehold.co/40x40.png?text=DS', location: 'Denver, CO', industry: 'IT Services', website: 'https://innovatech.com', linkedin_url: 'https://linkedin.com/in/darrellsteward' },
    { id: 'L010', name: 'Marvin McKinney', company: 'The Kraft Heinz Company', email: 'devenlane@gmail.com', status: 'New', lastContact: '2024-05-21T16:00:00Z', title: 'Brand Manager', phone: '(904) 555-0199', avatar: 'https://placehold.co/40x40.png?text=MM', location: 'Chicago, IL', industry: 'Food Production', website: 'https://kraftheinz.com', linkedin_url: 'https://linkedin.com/in/marvinmckinney' },
];

const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Lead Finder State
  const [aiTargetName, setAiTargetName] = useState('');
  const [aiTargetTitle, setAiTargetTitle] = useState('');
  const [aiTargetLocation, setAiTargetLocation] = useState('');
  const [aiTargetIndustry, setAiTargetIndustry] = useState('');
  const [aiTargetEmployeeCount, setAiTargetEmployeeCount] = useState('');
  const [aiTargetRevenue, setAiTargetRevenue] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [isLoadingAiLeads, setIsLoadingAiLeads] = useState(false);
  const [aiFoundLeads, setAiFoundLeads] = useState<FoundLead[]>([]);
  const [isFindLeadsPopoverOpen, setIsFindLeadsPopoverOpen] = useState(false);


  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "", company: "", email: "", status: "New", website: "", title: "", phone: "", location: "", industry: "", linkedin_url: ""
    },
  });

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({ variant: "destructive", title: "No file selected." });
      return;
    }
    if (file.type !== "text/csv") {
      toast({ variant: "destructive", title: "Invalid file type.", description: "Please upload a .csv file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (!csvText) {
        toast({ variant: "destructive", title: "File is empty." });
        return;
      }

      try {
        const lines = csvText.split(/\r\n|\n/);
        if (lines.length <= 1) {
          toast({ variant: "destructive", title: "CSV is empty or has no data rows." });
          return;
        }
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_')); // Normalize headers
        const requiredHeaders = ['name', 'company', 'email', 'status'];
        const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

        if (missingHeaders.length > 0) {
          toast({ variant: "destructive", title: "Missing required CSV columns.", description: `Required: ${missingHeaders.join(', ')}` });
          return;
        }

        const newLeads: Lead[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const data = values.map(value => value.replace(/^"|"$/g, '').trim());

          const leadData: any = {};
          headers.forEach((header, index) => {
            leadData[header] = data[index] || '';
          });
          
          if (!leadData.name || !leadData.company || !leadData.email || !leadData.status) {
            console.warn("Skipping row due to missing required data:", leadData);
            continue; 
          }

          const status = leadStatuses.includes(leadData.status as any) ? leadData.status : "New";

          newLeads.push({
            id: `L-${Date.now()}-${i}`,
            name: leadData.name,
            company: leadData.company,
            email: leadData.email,
            status: status as Lead["status"],
            lastContact: new Date().toISOString(),
            title: leadData.title || '',
            phone: leadData.phone || '',
            website: leadData.website || '',
            location: leadData.location || '',
            industry: leadData.industry || '',
            avatar: `https://placehold.co/40x40.png?text=${leadData.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}`,
            linkedin_url: leadData.linkedin_url || '',
          });
        }

        if (newLeads.length === 0) {
          toast({ title: "No new leads found in CSV." });
          return;
        }

        setLeads(prev => {
          const updated = [...prev, ...newLeads];
          localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updated));
          return updated;
        });
        toast({ title: "Import Successful", description: `${newLeads.length} leads added from CSV.` });

      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({ variant: "destructive", title: "Error parsing CSV.", description: "Please check the file format." });
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  function handleImportClick() {
    fileInputRef.current?.click();
  }
  
  function openAddModal(defaultValues?: Partial<LeadFormValues>) {
    form.reset(defaultValues || { name: "", company: "", email: "", status: "New", website: "", title: "", phone: "", location: "", industry: "", linkedin_url: "" });
    setEditingLead(null);
    setIsAddLeadOpen(true);
  }
  
  function handleFormSubmit(values: LeadFormValues) {
    const newLead: Lead = {
      ...values,
      id: `L-${Date.now()}`,
      lastContact: new Date().toISOString(),
      avatar: `https://placehold.co/40x40.png?text=${values.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}`,
    };
    setLeads(prev => {
      const updated = [newLead, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updated));
      return updated;
    });
    toast({ title: "New Lead Added", description: `${newLead.name} has been added.` });
    setIsAddLeadOpen(false);
  }
  
  const handleSelectAllRows = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    if (checked) {
      leads.forEach(lead => newSelectedRows[lead.id] = true);
    }
    setSelectedRows(newSelectedRows);
  };

  const isAllSelected = leads.length > 0 && leads.every(lead => selectedRows[lead.id]);

  const handleApplyAiFilters = async () => {
    setIsLoadingAiLeads(true);
    setAiFoundLeads([]);
    try {
      const input: FindLeadsInput = {
        targetName: aiTargetName || undefined,
        targetTitle: aiTargetTitle || undefined,
        targetLocation: aiTargetLocation || undefined,
        targetIndustry: aiTargetIndustry || undefined,
        targetEmployeeCount: aiTargetEmployeeCount || undefined,
        targetRevenue: aiTargetRevenue || undefined,
        keywords: aiKeywords || undefined,
      };
      const result = await findLeads(input);
      setAiFoundLeads(result.foundLeads || []);
      toast({ title: "AI Lead Search Complete", description: `Found ${result.foundLeads?.length || 0} potential leads.` });
    } catch (error) {
      console.error("Error finding AI leads:", error);
      toast({ variant: "destructive", title: "AI Lead Search Failed", description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
      setIsLoadingAiLeads(false);
      setIsFindLeadsPopoverOpen(false); // Close popover after search
    }
  };

  const handleClearAiFilters = () => {
    setAiTargetName('');
    setAiTargetTitle('');
    setAiTargetLocation('');
    setAiTargetIndustry('');
    setAiTargetEmployeeCount('');
    setAiTargetRevenue('');
    setAiKeywords('');
    setAiFoundLeads([]);
    toast({ title: "AI Filters Cleared" });
  };

  const handleAddAiLeadToList = (aiLead: FoundLead) => {
    const defaultValues: Partial<LeadFormValues> = {
        name: aiLead.potentialContactName || aiLead.companyName, // Prioritize contact name
        company: aiLead.companyName,
        email: aiLead.contactEmail || "", // Provide empty string if undefined
        website: aiLead.website || "",
        title: aiLead.potentialContactTitle || "",
        phone: aiLead.contactPhone || "",
        location: aiLead.location || "",
        industry: aiLead.industry || "",
        status: "New", // Default status for new AI leads
    };
    openAddModal(defaultValues);
  };


  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Leads</h1>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                style={{ display: 'none' }}
                id="csv-upload"
              />
              <Button variant="outline" onClick={handleImportClick} className="h-9">
                <Download className="mr-2 h-4 w-4" /> Import CSV
              </Button>
              
              <Popover open={isFindLeadsPopoverOpen} onOpenChange={setIsFindLeadsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <Search className="mr-2 h-4 w-4" /> Find Leads
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 shadow-xl rounded-lg border">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-foreground">Find Leads</h3>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => toast({title: "Bookmark", description: "Bookmark feature coming soon!"})}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <PopoverClose asChild>
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                             <X className="h-4 w-4" />
                           </Button>
                        </PopoverClose>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Name" value={aiTargetName} onChange={(e) => setAiTargetName(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Title (e.g. Founder, CEO)" value={aiTargetTitle} onChange={(e) => setAiTargetTitle(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Location (e.g. USA)" value={aiTargetLocation} onChange={(e) => setAiTargetLocation(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Industry" value={aiTargetIndustry} onChange={(e) => setAiTargetIndustry(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Employee Count (e.g. 0-25, 25-100)" value={aiTargetEmployeeCount} onChange={(e) => setAiTargetEmployeeCount(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Revenue (e.g. $1M - $10M)" value={aiTargetRevenue} onChange={(e) => setAiTargetRevenue(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <FilterIcon className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Keywords (e.g. B2B SaaS)" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={handleClearAiFilters}>Clear</Button>
                        <Button onClick={handleApplyAiFilters} disabled={isLoadingAiLeads}>
                          {isLoadingAiLeads ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                          Apply Filters
                        </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button onClick={() => openAddModal()} className="h-9 bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add to List
              </Button>
              <Button variant="outline" onClick={() => toast({title: "Add to Campaign", description: "This feature is coming soon!"})}  className="h-9">
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Campaign
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-6 pt-4 pb-6">
          <ScrollArea className="h-full">
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[48px] px-4 py-3">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked) => handleSelectAllRows(Boolean(checked))}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                    <TableHead className="min-w-[250px] py-3">Name</TableHead>
                    <TableHead className="min-w-[180px] py-3">Title</TableHead>
                    <TableHead className="min-w-[200px] py-3">Company</TableHead>
                    <TableHead className="min-w-[250px] py-3">Email</TableHead>
                    <TableHead className="min-w-[150px] py-3">Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLeads ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Loading leads...
                      </TableCell>
                    </TableRow>
                  ) : leads.length > 0 ? (
                    leads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50 border-b last:border-b-0">
                        <TableCell className="px-4 py-3">
                          <Checkbox
                            checked={selectedRows[lead.id] || false}
                            onCheckedChange={(checked) => {
                              setSelectedRows(prev => ({ ...prev, [lead.id]: Boolean(checked) }));
                            }}
                            aria-label={`Select row for ${lead.name}`}
                          />
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={lead.avatar} alt={lead.name} data-ai-hint="person avatar" />
                              <AvatarFallback>
                                {lead.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sm text-foreground">{lead.name}</span>
                              {lead.linkedin_url && (
                                <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" title="View LinkedIn Profile">
                                  <Linkedin className="h-3.5 w-3.5 text-primary hover:text-primary/80" />
                                </a>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">{lead.title || '-'}</TableCell>
                        <TableCell className="py-3 font-medium text-sm text-foreground">{lead.company}</TableCell>
                        <TableCell className="py-3">
                          <a 
                            href={`mailto:${lead.email}`} 
                            className="text-sm text-primary hover:text-primary/80 hover:underline"
                          >
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">{lead.phone || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No leads found. Click "Add to List" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>

        {/* AI Found Leads Section */}
        {aiFoundLeads.length > 0 && (
          <div className="px-6 py-4 border-t">
            <h2 className="text-lg font-semibold mb-4 flex items-center"><Sparkles className="h-5 w-5 mr-2 text-primary"/>AI Found Leads</h2>
            <ScrollArea className="h-[400px] pr-2"> {/* Added ScrollArea for potentially long list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiFoundLeads.map((aiLead, index) => (
                  <Card key={index} className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-md">{aiLead.companyName}</CardTitle>
                      {aiLead.potentialContactName && (
                        <CardDescription>
                          {aiLead.potentialContactName} {aiLead.potentialContactTitle && `(${aiLead.potentialContactTitle})`}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <p><strong>Industry:</strong> {aiLead.industry || 'N/A'}</p>
                      <p><strong>Location:</strong> {aiLead.location || 'N/A'}</p>
                      <p><strong>Reasoning:</strong> {aiLead.reasoning}</p>
                      {aiLead.website && <p><strong>Website:</strong> <a href={aiLead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{aiLead.website}</a></p>}
                      {aiLead.contactEmail && <p><strong>Email:</strong> <a href={`mailto:${aiLead.contactEmail}`} className="text-primary hover:underline">{aiLead.contactEmail}</a></p>}
                      {aiLead.contactPhone && <p><strong>Phone:</strong> {aiLead.contactPhone}</p>}
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" onClick={() => handleAddAiLeadToList(aiLead)}>
                        <Plus className="mr-2 h-4 w-4" /> Add to My Leads
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
         {isLoadingAiLeads && (
            <div className="px-6 py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Finding leads with AI...</p>
            </div>
        )}

      </div>

      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
            <DialogDescription>
              {editingLead ? "Update the details for this lead." : "Fill in the details for the new lead."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="CEO, Founder, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl><Input placeholder="Acme Inc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="linkedin_url" render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL (Optional)</FormLabel>
                  <FormControl><Input placeholder="https://linkedin.com/in/johndoe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl><Input placeholder="New York, NY" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry (Optional)</FormLabel>
                    <FormControl><Input placeholder="Technology" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {leadStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                <Button type="submit">{editingLead ? "Save Changes" : "Add Lead"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

