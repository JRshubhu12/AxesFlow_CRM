
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Users,
  PlusCircle,
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
  Users2 as UsersIcon,
  DollarSign,
  Search as SearchIcon,
  GraduationCap,
  Cpu,
  Info,
  Link as LinkIcon,
  Lightbulb,
  Building2 as DepartmentIcon,
  ListPlus,
  Linkedin,
  Sparkles,
  FileText,
  AlertTriangle,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Globe,
  CalendarDays as CalendarIcon, 
  Download,
  ChevronsUpDown,
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
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

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
  title?: string; // If you want to give chats titles
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
  location: z.string().optional(),
  industry: z.string().optional(),
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
  location?: string;
  industry?: string;
}

const leadStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed - Won", "Closed - Lost"] as const;

const initialLeadsData: Lead[] = [
  { id: 'L001', name: 'Elena Rodriguez', company: 'Sunrise Tech', email: 'elena.r@sunrisetech.com', status: 'New', lastContact: '2024-05-20', title: 'Marketing Director', phone: '(555) 123-4567', avatar: 'https://placehold.co/40x40.png?text=ER', website: 'https://sunrisetech.com', location: 'Austin, TX', industry: 'Software' },
  { id: 'L002', name: 'Marcus Chen', company: 'BlueWave Solutions', email: 'marcus.c@bluewave.io', status: 'Contacted', lastContact: '2024-05-22', title: 'CEO', phone: '(555) 234-5678', avatar: 'https://placehold.co/40x40.png?text=MC', website: 'https://bluewave.io', location: 'San Francisco, CA', industry: 'Cloud Services' },
  { id: 'L003', name: 'Aisha Khan', company: 'Innovate Hub', email: 'aisha.k@innovatehub.dev', status: 'Qualified', lastContact: '2024-05-18', title: 'Product Manager', phone: '(555) 345-6789', avatar: 'https://placehold.co/40x40.png?text=AK', website: 'https://innovatehub.dev', location: 'New York, NY', industry: 'AI Development' },
  { id: 'L004', name: 'David Miller', company: 'Quantum Leap Inc.', email: 'david.m@quantumleap.com', status: 'Proposal Sent', lastContact: '2024-05-25', title: 'VP of Sales', phone: '(555) 456-7890', avatar: 'https://placehold.co/40x40.png?text=DM', website: 'https://quantumleap.com', location: 'Boston, MA', industry: 'Biotechnology' },
  { id: 'L005', name: 'Sophia Loren', company: 'Artisan Goods Co.', email: 'sophia.l@artisangoods.com', status: 'Closed - Won', lastContact: '2024-04-10', title: 'Founder', phone: '(555) 567-8901', avatar: 'https://placehold.co/40x40.png?text=SL', website: 'https://artisangoods.com', location: 'Portland, OR', industry: 'E-commerce (Handmade)' },
  { id: 'L006', name: 'James Lee', company: 'CyberSecure Solutions', email: 'james.l@cybersecure.com', status: 'New', lastContact: '2024-05-26', title: 'CTO', phone: '(555) 678-9012', avatar: 'https://placehold.co/40x40.png?text=JL', website: 'https://cybersecure.com', location: 'Washington D.C.', industry: 'Cybersecurity' },
  { id: 'L007', name: 'Priya Sharma', company: 'HealthWell Clinics', email: 'priya.s@healthwell.org', status: 'Contacted', lastContact: '2024-05-24', title: 'Operations Manager', phone: '(555) 789-0123', avatar: 'https://placehold.co/40x40.png?text=PS', website: 'https://healthwell.org', location: 'Chicago, IL', industry: 'Healthcare' },
  { id: 'L008', name: 'Robert Green', company: 'EcoBuilders Group', email: 'robert.g@ecobuilders.com', status: 'Qualified', lastContact: '2024-05-19', title: 'Lead Architect', phone: '(555) 890-1234', avatar: 'https://placehold.co/40x40.png?text=RG', website: 'https://ecobuilders.com', location: 'Denver, CO', industry: 'Construction (Sustainable)' },
  { id: 'L009', name: 'Olivia White', company: 'FinTech Innovators', email: 'olivia.w@fintechinnov.com', status: 'Proposal Sent', lastContact: '2024-05-23', title: 'Senior Analyst', phone: '(555) 901-2345', avatar: 'https://placehold.co/40x40.png?text=OW', website: 'https://fintechinnov.com', location: 'London, UK', industry: 'Financial Technology' },
  { id: 'L010', name: 'Daniel Kim', company: 'Global Logistics Partner', email: 'daniel.k@globallogistics.co', status: 'Closed - Lost', lastContact: '2024-05-01', title: 'Supply Chain Director', phone: '(555) 012-3456', avatar: 'https://placehold.co/40x40.png?text=DK', website: 'https://globallogistics.co', location: 'Los Angeles, CA', industry: 'Logistics' },
  { id: 'L011', name: 'Chloe Dubois', company: 'Parisian Pastries', email: 'chloe.d@parisianpastries.fr', status: 'New', lastContact: '2024-05-27', title: 'Owner & Head Chef', phone: '+33 1 23 45 67 89', avatar: 'https://placehold.co/40x40.png?text=CD', website: 'https://parisianpastries.fr', location: 'Paris, France', industry: 'Food & Beverage' },
  { id: 'L012', name: 'Kenji Tanaka', company: 'Tokyo Robotics', email: 'kenji.t@tokyorobotics.jp', status: 'Contacted', lastContact: '2024-05-21', title: 'R&D Lead', phone: '+81 3-1234-5678', avatar: 'https://placehold.co/40x40.png?text=KT', website: 'https://tokyorobotics.jp', location: 'Tokyo, Japan', industry: 'Robotics' },
  { id: 'L013', name: 'Fatima Al Jamil', company: 'Desert Gems Travel', email: 'fatima.aj@desertgems.ae', status: 'Qualified', lastContact: '2024-05-17', title: 'Travel Consultant', phone: '+971 4 555 0101', avatar: 'https://placehold.co/40x40.png?text=FA', website: 'https://desertgems.ae', location: 'Dubai, UAE', industry: 'Travel & Tourism' },
  { id: 'L014', name: 'Carlos Silva', company: 'Amazonia Excursions', email: 'carlos.s@amazoniaexcursions.br', status: 'Proposal Sent', lastContact: '2024-05-20', title: 'Tour Organizer', phone: '+55 92 99999-0000', avatar: 'https://placehold.co/40x40.png?text=CS', website: 'https://amazoniaexcursions.br', location: 'Manaus, Brazil', industry: 'Eco-Tourism' },
  { id: 'L015', name: 'Isabelle Moreau', company: 'Montreal Media House', email: 'isabelle.m@montrealmedia.ca', status: 'New', lastContact: '2024-05-28', title: 'Content Strategist', phone: '(514) 555-0011', avatar: 'https://placehold.co/40x40.png?text=IM', website: 'https://montrealmedia.ca', location: 'Montreal, QC', industry: 'Media Production' },
  { id: 'L016', name: 'Raj Patel', company: 'Bangalore Software Park', email: 'raj.p@bangsoft.in', status: 'Contacted', lastContact: '2024-05-15', title: 'Senior Developer', phone: '+91 80 2345 6789', avatar: 'https://placehold.co/40x40.png?text=RP', website: 'https://bangsoft.in', location: 'Bangalore, India', industry: 'IT Services' },
  { id: 'L017', name: 'Maria Schmidt', company: 'Berlin Innovations GmbH', email: 'maria.s@berlininnov.de', status: 'Qualified', lastContact: '2024-05-22', title: 'Business Development', phone: '+49 30 1234567', avatar: 'https://placehold.co/40x40.png?text=MS', website: 'https://berlininnov.de', location: 'Berlin, Germany', industry: 'Startup Accelerator' },
  { id: 'L018', name: 'Ahmed Hassan', company: 'Cairo Digital Marketing', email: 'ahmed.h@cairodigital.eg', status: 'Proposal Sent', lastContact: '2024-05-16', title: 'SEO Specialist', phone: '+20 2 25550000', avatar: 'https://placehold.co/40x40.png?text=AH', website: 'https://cairodigital.eg', location: 'Cairo, Egypt', industry: 'Digital Marketing' },
  { id: 'L019', name: 'Luisa Fernández', company: 'Madrid Design Studio', email: 'luisa.f@madridstudio.es', status: 'Closed - Won', lastContact: '2024-04-25', title: 'Lead Graphic Designer', phone: '+34 912 345 678', avatar: 'https://placehold.co/40x40.png?text=LF', website: 'https://madridstudio.es', location: 'Madrid, Spain', industry: 'Design Agency' },
  { id: 'L020', name: 'Vladimir Ivanov', company: 'Moscow Consulting Group', email: 'vladimir.i@moscowconsult.ru', status: 'New', lastContact: '2024-05-29', title: 'Senior Consultant', phone: '+7 495 123-45-67', avatar: 'https://placehold.co/40x40.png?text=VI', website: 'https://moscowconsult.ru', location: 'Moscow, Russia', industry: 'Management Consulting' },
  { id: 'L021', name: 'Sarah Miller (Innovate Solutions Ltd.)', company: 'Innovate Solutions Ltd.', email: 'sarah.miller@innovate.com', status: 'New', lastContact: '2024-05-20', title: 'Marketing Manager', phone: '(123) 456-7890', avatar: 'https://placehold.co/40x40.png?text=SM', website: 'https://innovate.com', location: 'New York, USA', industry: 'Technology' },
  { id: 'L022', name: 'John Davis (TechPro Services)', company: 'TechPro Services', email: 'john.davis@techpro.com', status: 'Contacted', lastContact: '2024-05-18', title: 'Software Engineer', phone: '(234) 567-8901', avatar: 'https://placehold.co/40x40.png?text=JD', website: 'https://techpro.com', location: 'San Francisco, USA', industry: 'Software' },
  { id: 'L023', name: 'Maria Garcia (GreenLeaf Organics)', company: 'GreenLeaf Organics', email: 'maria.garcia@greenleaf.com', status: 'Qualified', lastContact: '2024-05-15', title: 'Product Owner', phone: '(345) 678-9012', avatar: 'https://placehold.co/40x40.png?text=MG', website: 'https://greenleaf.com', location: 'Austin, USA', industry: 'E-commerce' },
  { id: 'L024', name: 'David Wilson (Global Logistics Inc.)', company: 'Global Logistics Inc.', email: 'david.wilson@globallogistics.com', status: 'Proposal Sent', lastContact: '2024-05-10', title: 'Logistics Coordinator', phone: '(456) 789-0123', avatar: 'https://placehold.co/40x40.png?text=DW', website: 'https://globallogistics.com', location: 'Chicago, USA', industry: 'Logistics' },
  { id: 'L025', name: 'Linda Brown (Creative Designs Co.)', company: 'Creative Designs Co.', email: 'linda.brown@creativedesigns.com', status: 'Closed - Won', lastContact: '2024-04-28', title: 'Lead Designer', phone: '(567) 890-1234', avatar: 'https://placehold.co/40x40.png?text=LB', website: 'https://creativedesigns.com', location: 'Los Angeles, USA', industry: 'Design' }
];


const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';
const LOCAL_STORAGE_KEY_CHATS = 'chatsData';
const LOCAL_STORAGE_KEY_MEETINGS = 'meetingsData';

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'default',
  'Contacted': 'secondary',
  'Qualified': 'outline',
  'Proposal Sent': 'default', // Use primary color
  'Closed - Won': 'default', // Use accent or green-like color
  'Closed - Lost': 'destructive',
};

const filterSections = [
  // Keep the existing filterSections array, it is quite long so omitted for brevity here
  { id: 'name', label: 'Name', icon: UsersIcon, placeholder: 'Search by name...' },
  { id: 'title', label: 'Title', icon: Briefcase, placeholder: 'e.g., CEO, Founder' },
  { id: 'location', label: 'Location', icon: MapPin, placeholder: 'e.g., New York, Remote' },
  { id: 'industry', label: 'Industry', icon: Building, placeholder: 'e.g., Technology, Healthcare' },
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
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [nameFilter, setNameFilter] = useState("");
  const [titleFilterText, setTitleFilterText] = useState("");
  const [locationFilterText, setLocationFilterText] = useState("");
  const [industryFilterText, setIndustryFilterText] = useState("");
  const [keywordFilterText, setKeywordFilterText] = useState("");

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});


  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoadingLeads(true);
    const storedLeads = localStorage.getItem(LOCAL_STORAGE_KEY_LEADS);
    if (storedLeads) {
      try {
        const parsedLeads = JSON.parse(storedLeads);
        // Basic validation: check if it's an array
        if (Array.isArray(parsedLeads)) {
          setLeads(parsedLeads);
        } else {
          console.warn("Stored leads data is not an array, using initial data.");
          setLeads(initialLeadsData);
          localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(initialLeadsData));
        }
      } catch (e) {
        console.error("Failed to parse leads from localStorage, using initial data.", e);
        setLeads(initialLeadsData);
        localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(initialLeadsData));
      }
    } else {
      setLeads(initialLeadsData);
      localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(initialLeadsData));
    }
    setIsLoadingLeads(false);
  }, []);
  
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
      location: "",
      industry: "",
    },
  });

  const editForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const handleAddLeadSubmit = (values: LeadFormValues) => {
    const newLead: Lead = {
      ...values,
      id: `L${Date.now()}`,
      lastContact: new Date().toISOString().split('T')[0],
      avatar: `https://placehold.co/40x40.png?text=${values.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}`,
    };
    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));
    toast({ title: "Lead Added", description: `${newLead.name} has been added.` });
    form.reset();
    setIsAddLeadOpen(false);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    editForm.reset({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      status: lead.status,
      website: lead.website || "",
      title: lead.title || "",
      phone: lead.phone || "",
      location: lead.location || "",
      industry: lead.industry || "",
    });
    setIsEditLeadOpen(true);
  };

  const handleEditLeadSubmit = (values: LeadFormValues) => {
    if (!editingLead) return;
    const updatedLeads = leads.map(lead =>
      lead.id === editingLead.id ? { ...lead, ...values, lastContact: new Date().toISOString().split('T')[0] } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));
    toast({ title: "Lead Updated", description: `${values.name} has been updated.` });
    setIsEditLeadOpen(false);
    setEditingLead(null);
  };

  const handleChangeStatus = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));
    toast({ title: "Status Updated", description: `Lead status changed to ${newStatus}.` });
  };
  
  const handleStartChat = (lead: Lead) => {
    const storedChats = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
    const currentChats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    
    const newChat: Chat = {
      id: `C-${Date.now()}`,
      contact: `${lead.name} (${lead.company})`,
      lastMessage: 'Chat initiated...',
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
      title: `Meeting with ${lead.name}`,
      type: 'Video Call',
      dateTime: format(new Date(), "PPpp"),
      status: 'Scheduled',
      participants: ['You', lead.name],
      googleMeetLink: 'https://meet.google.com/new', // Placeholder
    };
    const updatedMeetings = [newMeeting, ...currentMeetings];
    localStorage.setItem(LOCAL_STORAGE_KEY_MEETINGS, JSON.stringify(updatedMeetings));
    toast({ title: "Meeting Scheduled", description: `Meeting with ${lead.name} scheduled. Redirecting...` });
    router.push('/communications?tab=meetings');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({ variant: "destructive", title: "No file selected." });
      return;
    }

    if (file.type !== "text/csv") {
      toast({ variant: "destructive", title: "Invalid file type.", description: "Please upload a CSV file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        toast({ variant: "destructive", title: "File is empty." });
        return;
      }
      try {
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) { // Header + at least one data row
          toast({ variant: "destructive", title: "CSV Error", description: "CSV file must contain a header row and at least one data row." });
          return;
        }

        const headerLine = lines[0].toLowerCase(); // Make headers case-insensitive
        const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
        
        const requiredHeaders = ['name', 'company', 'email', 'status'];
        const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

        if (missingHeaders.length > 0) {
          toast({ variant: "destructive", title: "CSV Header Error", description: `Missing required columns: ${missingHeaders.join(', ')}.` });
          return;
        }

        const nameIndex = headers.indexOf('name');
        const companyIndex = headers.indexOf('company');
        const emailIndex = headers.indexOf('email');
        const statusIndex = headers.indexOf('status');
        const titleIndex = headers.indexOf('title');
        const phoneIndex = headers.indexOf('phone');
        const websiteIndex = headers.indexOf('website');
        const locationIndex = headers.indexOf('location');
        const industryIndex = headers.indexOf('industry');


        const newLeads: Lead[] = [];
        for (let i = 1; i < lines.length; i++) {
          const data = lines[i].split(',').map(d => d.trim().replace(/"/g, ''));
          const leadName = data[nameIndex];
          const leadCompany = data[companyIndex];
          const leadEmail = data[emailIndex];
          let leadStatus = data[statusIndex] as Lead['status'];

          if (!leadName || !leadCompany || !leadEmail || !leadStatus) {
            console.warn(`Skipping row ${i+1} due to missing required data.`);
            continue; 
          }
          if (!leadStatuses.includes(leadStatus)) {
            leadStatus = 'New'; // Default if status is invalid
          }

          newLeads.push({
            id: `L-CSV-${Date.now()}-${i}`,
            name: leadName,
            company: leadCompany,
            email: leadEmail,
            status: leadStatus,
            lastContact: new Date().toISOString().split('T')[0],
            avatar: `https://placehold.co/40x40.png?text=${leadName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}`,
            title: titleIndex > -1 ? data[titleIndex] : undefined,
            phone: phoneIndex > -1 ? data[phoneIndex] : undefined,
            website: websiteIndex > -1 ? data[websiteIndex] : undefined,
            location: locationIndex > -1 ? data[locationIndex] : undefined,
            industry: industryIndex > -1 ? data[industryIndex] : undefined,
          });
        }

        if (newLeads.length === 0 && lines.length > 1) {
            toast({ variant: "destructive", title: "Import Failed", description: "No valid leads found in CSV after header." });
            return;
        }
        
        if (newLeads.length > 0) {
            const updatedLeads = [...newLeads, ...leads];
            setLeads(updatedLeads);
            localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));
            toast({ title: "Import Successful", description: `${newLeads.length} leads imported.` });
        } else {
            toast({ variant: "destructive", title: "No Leads Imported", description: "The CSV file did not contain any valid leads to import or was empty." });
        }

      } catch (error) {
        console.error("CSV Parsing error:", error);
        toast({ variant: "destructive", title: "Import Failed", description: "Error parsing CSV file. Please check the file format." });
      }
    };
    reader.onerror = () => {
        toast({ variant: "destructive", title: "File Read Error", description: "Could not read the selected file." });
    }
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredLeads = useMemo(() => {
    let tempLeads = leads;
    if (statusFilter !== "All") {
      tempLeads = tempLeads.filter(lead => lead.status === statusFilter);
    }
    if (nameFilter) {
      tempLeads = tempLeads.filter(lead => lead.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (titleFilterText) {
      tempLeads = tempLeads.filter(lead => lead.title?.toLowerCase().includes(titleFilterText.toLowerCase()));
    }
    if (locationFilterText) {
      tempLeads = tempLeads.filter(lead => lead.location?.toLowerCase().includes(locationFilterText.toLowerCase()));
    }
    if (industryFilterText) {
      tempLeads = tempLeads.filter(lead => lead.industry?.toLowerCase().includes(industryFilterText.toLowerCase()));
    }
    if (keywordFilterText) {
      const keyword = keywordFilterText.toLowerCase();
      tempLeads = tempLeads.filter(lead =>
        lead.name.toLowerCase().includes(keyword) ||
        lead.company.toLowerCase().includes(keyword) ||
        lead.email.toLowerCase().includes(keyword) ||
        (lead.title && lead.title.toLowerCase().includes(keyword)) ||
        (lead.location && lead.location.toLowerCase().includes(keyword)) ||
        (lead.industry && lead.industry.toLowerCase().includes(keyword))
      );
    }
    return tempLeads;
  }, [leads, statusFilter, nameFilter, titleFilterText, locationFilterText, industryFilterText, keywordFilterText]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "All") count++;
    if (nameFilter) count++;
    if (titleFilterText) count++;
    if (locationFilterText) count++;
    if (industryFilterText) count++;
    if (keywordFilterText) count++;
    return count;
  }, [statusFilter, nameFilter, titleFilterText, locationFilterText, industryFilterText, keywordFilterText]);
  
  const handleClearFilters = () => {
    setStatusFilter("All");
    setNameFilter("");
    setTitleFilterText("");
    setLocationFilterText("");
    setIndustryFilterText("");
    setKeywordFilterText("");
    toast({ title: "Filters Cleared" });
  };
  
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="bg-card dark:bg-gray-900 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground dark:text-white">People</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredLeads.length} {filteredLeads.length === 1 ? 'person' : 'people'} found
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={isFiltersOpen ? "secondary" : "outline"} 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="md:hidden"
              >
                <ListFilter className="h-4 w-4 mr-2" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                style={{ display: 'none' }}
                id="csv-upload"
              />
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" /> Import CSV
              </Button>
              <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Person
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Person</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new contact. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddLeadSubmit)} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="title" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="CEO" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="location" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="New York, NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="industry" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <Input placeholder="Technology" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
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
                      )}/>
                      <DialogFooter>
                        <Button type="submit">Add Person</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {isFiltersOpen && (
          <div className="md:hidden bg-card dark:bg-gray-900 border-b p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Filters</h3>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear all {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      {leadStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input 
                    placeholder="Search names..." 
                    className="h-8 text-xs" 
                    value={nameFilter} 
                    onChange={(e) => setNameFilter(e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Keyword</Label>
                  <Input 
                    placeholder="Any keyword..." 
                    className="h-8 text-xs" 
                    value={keywordFilterText} 
                    onChange={(e) => setKeywordFilterText(e.target.value)} 
                  />
                </div>
                 <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input 
                    placeholder="e.g., CEO" 
                    className="h-8 text-xs" 
                    value={titleFilterText} 
                    onChange={(e) => setTitleFilterText(e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input 
                    placeholder="e.g., New York" 
                    className="h-8 text-xs" 
                    value={locationFilterText} 
                    onChange={(e) => setLocationFilterText(e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Industry</Label>
                  <Input 
                    placeholder="e.g., Technology" 
                    className="h-8 text-xs" 
                    value={industryFilterText} 
                    onChange={(e) => setIndustryFilterText(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Filters */}
          <ScrollArea className="w-64 border-r bg-muted/30 dark:bg-gray-800 p-4 hidden md:block">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleClearFilters}
                    disabled={activeFilterCount === 0}
                    title="Clear all filters"
                  >
                    <RefreshCw className={`h-4 w-4 ${activeFilterCount > 0 ? 'text-primary' : ''}`} />
                    {activeFilterCount > 0 && <span className="text-xs text-primary ml-1">({activeFilterCount})</span>}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <SearchIcon className="h-4 w-4 text-muted-foreground" />
                    Keyword
                  </Label>
                  <Input 
                    placeholder="Search all fields..." 
                    className="h-9" 
                    value={keywordFilterText} 
                    onChange={(e) => setKeywordFilterText(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    Status
                  </Label>
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
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Name
                  </Label>
                  <Input 
                    placeholder="Search by name..." 
                    className="h-9" 
                    value={nameFilter} 
                    onChange={(e) => setNameFilter(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Title
                  </Label>
                  <Input 
                    placeholder="e.g., CEO, Founder" 
                    className="h-9" 
                    value={titleFilterText} 
                    onChange={(e) => setTitleFilterText(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Location
                  </Label>
                  <Input 
                    placeholder="e.g., New York, Remote" 
                    className="h-9" 
                    value={locationFilterText} 
                    onChange={(e) => setLocationFilterText(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    Industry
                  </Label>
                  <Input 
                    placeholder="e.g., Technology, Healthcare" 
                    className="h-9" 
                    value={industryFilterText} 
                    onChange={(e) => setIndustryFilterText(e.target.value)} 
                  />
                </div>

                {/* Placeholder filters from design */}
                {filterSections.filter(s => !['name', 'title', 'location', 'industry', 'keywordFilter'].includes(s.id)).map((section) => (
                  <div key={section.id} className="space-y-2 opacity-50 cursor-not-allowed">
                     <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
                      <section.icon className="h-4 w-4 text-muted-foreground" /> {section.label}
                    </Label>
                    <Input placeholder={section.placeholder} className="h-9" disabled />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Leads Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 overflow-auto">
              {isLoadingLeads ? (
                <div className="flex-1 flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
                  <Table>
                    <TableHeader className="bg-muted/50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead className="w-[48px] px-4">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={(checked) => handleSelectAllRows(Boolean(checked))}
                            aria-label="Select all rows"
                          />
                        </TableHead>
                        <TableHead className="min-w-[200px]">Person</TableHead>
                        <TableHead className="min-w-[150px]">Title</TableHead>
                        <TableHead className="min-w-[200px]">Company</TableHead>
                        <TableHead className="min-w-[200px]">Contact</TableHead>
                        <TableHead className="text-right min-w-[120px]">Status & Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                          <TableRow 
                            key={lead.id} 
                            className="hover:bg-muted/50 dark:hover:bg-gray-800/50"
                            data-state={selectedRows[lead.id] ? "selected" : ""}
                          >
                            <TableCell className="px-4">
                              <Checkbox
                                checked={selectedRows[lead.id] || false}
                                onCheckedChange={(checked) => {
                                  setSelectedRows(prev => ({ ...prev, [lead.id]: Boolean(checked) }));
                                }}
                                aria-label={`Select row for ${lead.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={lead.avatar} alt={lead.name} data-ai-hint="person portrait"/>
                                  <AvatarFallback>
                                    {lead.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">{lead.name}</div>
                                  {lead.website && (
                                    <a 
                                      href={lead.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-xs text-primary hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()} // Prevent row click
                                    >
                                      <Linkedin className="h-3 w-3" /> Website
                                    </a>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">{lead.title || '-'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">{lead.company}</div>
                              {lead.industry && (
                                <div className="text-sm text-muted-foreground">{lead.industry}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                <a 
                                  href={`mailto:${lead.email}`} 
                                  className="text-primary hover:underline flex items-center gap-1 text-sm"
                                  onClick={(e) => e.stopPropagation()} // Prevent row click
                                >
                                  <MailIcon className="h-3.5 w-3.5" />
                                  {lead.email}
                                </a>
                                {lead.phone && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <PhoneIcon className="h-3.5 w-3.5" />
                                    {lead.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Badge 
                                  variant={statusVariantMap[lead.status]} 
                                  className={cn(
                                    lead.status === 'Proposal Sent' && 'bg-primary text-primary-foreground',
                                    lead.status === 'Closed - Won' && 'bg-green-500 text-white hover:bg-green-600'
                                  )}
                                >
                                  {lead.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions for {lead.name}</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => openEditModal(lead)}>
                                      <Edit3 className="mr-2 h-4 w-4" />
                                      Edit Lead
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStartChat(lead)}>
                                      <MessageCircle className="mr-2 h-4 w-4" />
                                      Start Chat
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleScheduleMeeting(lead)}>
                                      <CalendarPlus className="mr-2 h-4 w-4" />
                                      Schedule Meeting
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
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            {leads.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <Users className="h-10 w-10 mb-2" />
                                <p className="text-lg font-medium">No people found</p>
                                <p className="text-sm">
                                  Get started by adding a new person or importing a CSV.
                                </p>
                                <Button className="mt-4" onClick={() => setIsAddLeadOpen(true)}>
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add Person
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <SearchIcon className="h-10 w-10 mb-2" />
                                <p className="text-lg font-medium">No matching people found</p>
                                <p className="text-sm">
                                  Try adjusting your search or filter criteria.
                                </p>
                                <Button 
                                  variant="outline" 
                                  className="mt-4" 
                                  onClick={handleClearFilters}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Clear filters
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
               {/* Placeholder for pagination controls from design */}
              <div className="flex items-center justify-end space-x-2 py-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                    <p>Rows per page</p>
                    <Select value="10">
                        <SelectTrigger className="w-[70px] h-8">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>1-10 of {filteredLeads.length}</div>
                <div className="flex items-center space-x-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                        <ChevronsUpDown className="h-4 w-4 transform rotate-90" />
                        <span className="sr-only">First page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                        <ChevronsUpDown className="h-4 w-4 transform -rotate-90"/>
                        <span className="sr-only">Last page</span>
                    </Button>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Person</DialogTitle>
            <DialogDescription>
              Update this person's details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          {editingLead && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditLeadSubmit)} className="space-y-4 py-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={editingLead?.avatar} />
                      <AvatarFallback>
                        {editingLead?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="w-full" type="button" onClick={()=>toast({title: "Feature coming soon!"})}>
                      Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <FormField control={editForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={editForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                </div>
                
                <FormField control={editForm.control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={editForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={editForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>

                <FormField control={editForm.control} name="website" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={editForm.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={editForm.control} name="industry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>

                <FormField control={editForm.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
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
                )}/>

                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

// Helper for ChevronRight and ChevronLeft
const ChevronLeft = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRight = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="m9 18 6-6-6-6"/></svg>
);

    