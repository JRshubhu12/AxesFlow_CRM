
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
  AlertTriangle
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
  { id: 'L001', name: 'Aisha Khan', company: 'Innovatech Solutions', email: 'aisha.khan@innovatech.com', status: 'New', lastContact: format(new Date(2024, 0, 15), "yyyy-MM-dd"), website: 'https://innovatech.com', title: 'Marketing Director', phone: '(555) 123-4567', avatar: 'https://placehold.co/40x40.png?text=AK', location: "New York, NY", industry: "Technology" },
  { id: 'L002', name: 'Ben Carter', company: 'Synergy Corp', email: 'ben.carter@synergy.org', status: 'Contacted', lastContact: format(new Date(2024, 1, 20), "yyyy-MM-dd"), website: 'https://synergy.org', title: 'VP of Sales', phone: '(555) 234-5678', avatar: 'https://placehold.co/40x40.png?text=BC', location: "Chicago, IL", industry: "Consulting" },
  { id: 'L003', name: 'Chloe Davis', company: 'Momentum Dynamics', email: 'chloe.davis@momentum.io', status: 'Qualified', lastContact: format(new Date(2024, 2, 10), "yyyy-MM-dd"), website: 'https://momentum.io', title: 'Product Manager', phone: '(555) 345-6789', avatar: 'https://placehold.co/40x40.png?text=CD', location: "San Francisco, CA", industry: "SaaS" },
  { id: 'L004', name: 'David Evans', company: 'QuantumLeap AI', email: 'david.evans@quantumleap.ai', status: 'Proposal Sent', lastContact: format(new Date(2024, 3, 5), "yyyy-MM-dd"), website: 'https://quantumleap.ai', title: 'CEO', phone: '(555) 456-7890', avatar: 'https://placehold.co/40x40.png?text=DE', location: "Austin, TX", industry: "Artificial Intelligence" },
  { id: 'L005', name: 'Eva Green', company: 'EcoBuilders Inc.', email: 'eva.green@ecobuilders.com', status: 'New', lastContact: format(new Date(2024, 4, 12), "yyyy-MM-dd"), website: 'https://ecobuilders.com', title: 'Sustainability Officer', phone: '(555) 567-8901', avatar: 'https://placehold.co/40x40.png?text=EG', location: "Denver, CO", industry: "Construction" },
  { id: 'L006', name: 'Frank Harris', company: 'HealthWell Pharma', email: 'frank.harris@healthwell.co', status: 'Contacted', lastContact: format(new Date(2024, 0, 25), "yyyy-MM-dd"), website: 'https://healthwell.co', title: 'Research Lead', phone: '(555) 678-9012', avatar: 'https://placehold.co/40x40.png?text=FH', location: "Boston, MA", industry: "Pharmaceuticals" },
  { id: 'L007', name: 'Grace Infinity', company: 'Starlight Studios', email: 'grace.infinity@starlight.com', status: 'Qualified', lastContact: format(new Date(2024, 1, 18), "yyyy-MM-dd"), website: 'https://starlight.com', title: 'Creative Director', phone: '(555) 789-0123', avatar: 'https://placehold.co/40x40.png?text=GI', location: "Los Angeles, CA", industry: "Media & Entertainment" },
  { id: 'L008', name: 'Henry Jackson', company: 'NextGen Robotics', email: 'henry.jackson@nextgen.robotics', status: 'Proposal Sent', lastContact: format(new Date(2024, 2, 28), "yyyy-MM-dd"), website: 'https://nextgen.robotics', title: 'CTO', phone: '(555) 890-1234', avatar: 'https://placehold.co/40x40.png?text=HJ', location: "Pittsburgh, PA", industry: "Robotics" },
  { id: 'L009', name: 'Isabelle King', company: 'Apex Logistics', email: 'isabelle.king@apexlog.com', status: 'Closed - Won', lastContact: format(new Date(2024, 3, 15), "yyyy-MM-dd"), website: 'https://apexlog.com', title: 'Operations Manager', phone: '(555) 901-2345', avatar: 'https://placehold.co/40x40.png?text=IK', location: "Dallas, TX", industry: "Logistics" },
  { id: 'L010', name: 'Jack Lee', company: 'FinSecure Capital', email: 'jack.lee@finsecure.com', status: 'Closed - Lost', lastContact: format(new Date(2024, 4, 1), "yyyy-MM-dd"), website: 'https://finsecure.com', title: 'Financial Advisor', phone: '(555) 012-3456', avatar: 'https://placehold.co/40x40.png?text=JL', location: "New York, NY", industry: "Finance" },
  { id: 'L011', name: 'Katherine Miller', company: 'EduSphere Online', email: 'k.miller@edusphere.com', status: 'New', lastContact: format(new Date(2024, 0, 5), "yyyy-MM-dd"), website: 'https://edusphere.com', title: 'Curriculum Developer', phone: '(555) 112-2334', avatar: 'https://placehold.co/40x40.png?text=KM', location: "Seattle, WA", industry: "EdTech" },
  { id: 'L012', name: 'Liam Nelson', company: 'AgriFuture Corp', email: 'liam.nelson@agrifuture.com', status: 'Contacted', lastContact: format(new Date(2024, 1, 12), "yyyy-MM-dd"), website: 'https://agrifuture.com', title: 'Agronomist', phone: '(555) 223-3445', avatar: 'https://placehold.co/40x40.png?text=LN', location: "Des Moines, IA", industry: "Agriculture" },
  { id: 'L013', name: 'Mia Ocampo', company: 'RetailRevolution', email: 'mia.ocampo@retailrev.com', status: 'Qualified', lastContact: format(new Date(2024, 2, 20), "yyyy-MM-dd"), website: 'https://retailrev.com', title: 'E-commerce Strategist', phone: '(555) 334-4556', avatar: 'https://placehold.co/40x40.png?text=MO', location: "Miami, FL", industry: "E-commerce" },
  { id: 'L014', name: 'Noah Patel', company: 'AeroDynamics Ltd.', email: 'noah.patel@aerodynamics.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 3, 25), "yyyy-MM-dd"), website: 'https://aerodynamics.com', title: 'Aerospace Engineer', phone: '(555) 445-5667', avatar: 'https://placehold.co/40x40.png?text=NP', location: "Huntsville, AL", industry: "Aerospace" },
  { id: 'L015', name: 'Olivia Quinn', company: 'SoundWave Audio', email: 'olivia.quinn@soundwave.com', status: 'New', lastContact: format(new Date(2024, 4, 8), "yyyy-MM-dd"), website: 'https://soundwave.com', title: 'Audio Engineer', phone: '(555) 556-6778', avatar: 'https://placehold.co/40x40.png?text=OQ', location: "Nashville, TN", industry: "Music Production" },
  { id: 'L016', name: 'Peter Roberts', company: 'CyberGuard Inc.', email: 'peter.roberts@cyberguard.com', status: 'Contacted', lastContact: format(new Date(2024, 0, 1), "yyyy-MM-dd"), website: 'https://cyberguard.com', title: 'Security Analyst', phone: '(555) 667-7889', avatar: 'https://placehold.co/40x40.png?text=PR', location: "Washington D.C.", industry: "Cybersecurity" },
  { id: 'L017', name: 'Quinn Sanchez', company: 'Velocity Motors', email: 'quinn.sanchez@velocity.com', status: 'Qualified', lastContact: format(new Date(2024, 1, 5), "yyyy-MM-dd"), website: 'https://velocity.com', title: 'Automotive Designer', phone: '(555) 778-8990', avatar: 'https://placehold.co/40x40.png?text=QS', location: "Detroit, MI", industry: "Automotive" },
  { id: 'L018', name: 'Rachel Taylor', company: 'GlobalConnect Telecom', email: 'r.taylor@globalconnect.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 2, 15), "yyyy-MM-dd"), website: 'https://globalconnect.com', title: 'Network Engineer', phone: '(555) 889-9001', avatar: 'https://placehold.co/40x40.png?text=RT', location: "Atlanta, GA", industry: "Telecommunications" },
  { id: 'L019', name: 'Samuel White', company: 'TerraForm Realty', email: 'samuel.white@terraform.com', status: 'Closed - Won', lastContact: format(new Date(2024, 3, 22), "yyyy-MM-dd"), website: 'https://terraform.com', title: 'Real Estate Developer', phone: '(555) 990-0112', avatar: 'https://placehold.co/40x40.png?text=SW', location: "Phoenix, AZ", industry: "Real Estate" },
  { id: 'L020', name: 'Tara Young', company: 'Zenith Travel', email: 'tara.young@zenithtravel.com', status: 'New', lastContact: format(new Date(2024, 4, 2), "yyyy-MM-dd"), website: 'https://zenithtravel.com', title: 'Travel Consultant', phone: '(555) 001-1223', avatar: 'https://placehold.co/40x40.png?text=TY', location: "Orlando, FL", industry: "Travel & Tourism" },
  { id: 'L021', name: 'Uma Patel', company: 'BioGenesis Labs', email: 'uma.patel@biogenesis.com', status: 'Contacted', lastContact: format(new Date(2024, 0, 28), "yyyy-MM-dd"), website: 'https://biogenesis.com', title: 'Lab Director', phone: '(555) 121-2324', avatar: 'https://placehold.co/40x40.png?text=UP', location: "San Diego, CA", industry: "Biotechnology" },
  { id: 'L022', name: 'Victor Chen', company: 'Quantum Computing Ltd', email: 'v.chen@quantum.com', status: 'Qualified', lastContact: format(new Date(2024, 1, 22), "yyyy-MM-dd"), website: 'https://quantum.com', title: 'Quantum Physicist', phone: '(555) 232-3435', avatar: 'https://placehold.co/40x40.png?text=VC', location: "Cambridge, MA", industry: "Quantum Computing" },
  { id: 'L023', name: 'Wendy Garcia', company: 'FoodieFiesta Catering', email: 'wendy.g@foodiefiesta.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 2, 18), "yyyy-MM-dd"), website: 'https://foodiefiesta.com', title: 'Head Chef', phone: '(555) 343-4546', avatar: 'https://placehold.co/40x40.png?text=WG', location: "New Orleans, LA", industry: "Food & Beverage" },
  { id: 'L024', name: 'Xavier Rodriguez', company: 'Solstice Energy', email: 'x.rodriguez@solstice.com', status: 'New', lastContact: format(new Date(2024, 3, 10), "yyyy-MM-dd"), website: 'https://solstice.com', title: 'Renewable Energy Specialist', phone: '(555) 454-5657', avatar: 'https://placehold.co/40x40.png?text=XR', location: "Sacramento, CA", industry: "Renewable Energy" },
  { id: 'L025', name: 'Yara Ahmed', company: 'FashionForward Online', email: 'yara.ahmed@fashionforward.com', status: 'Contacted', lastContact: format(new Date(2024, 4, 5), "yyyy-MM-dd"), website: 'https://fashionforward.com', title: 'Lead Stylist', phone: '(555) 565-6768', avatar: 'https://placehold.co/40x40.png?text=YA', location: "New York, NY", industry: "Fashion" },
  { id: 'L026', name: 'Zane Williams', company: 'FutureTech Solutions', email: 'zane.williams@futuretech.com', status: 'Qualified', lastContact: format(new Date(2024, 0, 18), "yyyy-MM-dd"), website: 'https://futuretech.com', title: 'AI Specialist', phone: '(555) 111-2222', avatar: 'https://placehold.co/40x40.png?text=ZW', location: 'Austin, TX', industry: 'AI & Machine Learning' },
  { id: 'L027', name: 'Olivia Chen', company: 'CloudNova Hosting', email: 'olivia.chen@cloudnova.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 1, 25), "yyyy-MM-dd"), website: 'https://cloudnova.com', title: 'Cloud Solutions Architect', phone: '(555) 222-3333', avatar: 'https://placehold.co/40x40.png?text=OC', location: 'Seattle, WA', industry: 'Cloud Computing' },
  { id: 'L028', name: 'Lucas Rodriguez', company: 'DataDriven Insights', email: 'lucas.rodriguez@datadriven.com', status: 'New', lastContact: format(new Date(2024, 2, 12), "yyyy-MM-dd"), website: 'https://datadriven.com', title: 'Data Scientist', phone: '(555) 333-4444', avatar: 'https://placehold.co/40x40.png?text=LR', location: 'Boston, MA', industry: 'Data Analytics' },
  { id: 'L029', name: 'Sophia Patel', company: 'MobileFirst Gaming', email: 'sophia.patel@mobilefirst.com', status: 'Contacted', lastContact: format(new Date(2024, 3, 28), "yyyy-MM-dd"), website: 'https://mobilefirst.com', title: 'Game Developer', phone: '(555) 444-5555', avatar: 'https://placehold.co/40x40.png?text=SP', location: 'San Francisco, CA', industry: 'Gaming' },
  { id: 'L030', name: 'Ethan Kim', company: 'SecureNet Systems', email: 'ethan.kim@securenet.com', status: 'Qualified', lastContact: format(new Date(2024, 4, 15), "yyyy-MM-dd"), website: 'https://securenet.com', title: 'Cybersecurity Engineer', phone: '(555) 555-6666', avatar: 'https://placehold.co/40x40.png?text=EK', location: 'Washington D.C.', industry: 'Cybersecurity' },
  { id: 'L031', name: 'Ava Singh', company: 'HealthBridge Solutions', email: 'ava.singh@healthbridge.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 0, 20), "yyyy-MM-dd"), website: 'https://healthbridge.com', title: 'Healthcare Consultant', phone: '(555) 666-7777', avatar: 'https://placehold.co/40x40.png?text=AS', location: 'Chicago, IL', industry: 'Healthcare IT' },
  { id: 'L032', name: 'Noah Brown', company: 'FinTech Innovators', email: 'noah.brown@fintechinnovators.com', status: 'New', lastContact: format(new Date(2024, 1, 10), "yyyy-MM-dd"), website: 'https://fintechinnovators.com', title: 'Financial Analyst', phone: '(555) 777-8888', avatar: 'https://placehold.co/40x40.png?text=NB', location: 'New York, NY', industry: 'FinTech' },
  { id: 'L033', name: 'Isabella Garcia', company: 'EcoSolutions Group', email: 'isabella.garcia@ecosolutions.com', status: 'Contacted', lastContact: format(new Date(2024, 2, 22), "yyyy-MM-dd"), website: 'https://ecosolutions.com', title: 'Environmental Scientist', phone: '(555) 888-9999', avatar: 'https://placehold.co/40x40.png?text=IG', location: 'Denver, CO', industry: 'Environmental Services' },
  { id: 'L034', name: 'James Wilson', company: 'MediaMax Agency', email: 'james.wilson@mediamax.com', status: 'Qualified', lastContact: format(new Date(2024, 3, 18), "yyyy-MM-dd"), website: 'https://mediamax.com', title: 'Digital Marketing Manager', phone: '(555) 999-0000', avatar: 'https://placehold.co/40x40.png?text=JW', location: 'Los Angeles, CA', industry: 'Digital Marketing' },
  { id: 'L035', name: 'Mia Johnson', company: 'EduTech Global', email: 'mia.johnson@edutechglobal.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 4, 28), "yyyy-MM-dd"), website: 'https://edutechglobal.com', title: 'Instructional Designer', phone: '(555) 000-1111', avatar: 'https://placehold.co/40x40.png?text=MJ', location: 'Toronto, ON', industry: 'EdTech' },
  { id: 'L036', name: 'Alexander Lee', company: 'RealEstate Pros', email: 'alexander.lee@realestatepros.com', status: 'New', lastContact: format(new Date(2024, 0, 8), "yyyy-MM-dd"), website: 'https://realestatepros.com', title: 'Real Estate Agent', phone: '(555) 123-1122', avatar: 'https://placehold.co/40x40.png?text=AL', location: 'Miami, FL', industry: 'Real Estate' },
  { id: 'L037', name: 'Charlotte Martinez', company: 'TravelWise Adventures', email: 'charlotte.martinez@travelwise.com', status: 'Contacted', lastContact: format(new Date(2024, 1, 14), "yyyy-MM-dd"), website: 'https://travelwise.com', title: 'Travel Specialist', phone: '(555) 234-2233', avatar: 'https://placehold.co/40x40.png?text=CM', location: 'Orlando, FL', industry: 'Travel & Tourism' },
  { id: 'L038', name: 'Daniel Rodriguez', company: 'AutoMotion Inc.', email: 'daniel.rodriguez@automotion.com', status: 'Qualified', lastContact: format(new Date(2024, 2, 5), "yyyy-MM-dd"), website: 'https://automotion.com', title: 'Automotive Engineer', phone: '(555) 345-3344', avatar: 'https://placehold.co/40x40.png?text=DR', location: 'Detroit, MI', industry: 'Automotive' },
  { id: 'L039', name: 'Emily Nguyen', company: 'FashionHub Boutique', email: 'emily.nguyen@fashionhub.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 3, 1), "yyyy-MM-dd"), website: 'https://fashionhub.com', title: 'Fashion Buyer', phone: '(555) 456-4455', avatar: 'https://placehold.co/40x40.png?text=EN', location: 'Paris, FR', industry: 'Fashion' },
  { id: 'L040', name: 'Michael Brown', company: 'LegalEase Solutions', email: 'michael.brown@legalease.com', status: 'New', lastContact: format(new Date(2024, 4, 10), "yyyy-MM-dd"), website: 'https://legalease.com', title: 'Paralegal', phone: '(555) 567-5566', avatar: 'https://placehold.co/40x40.png?text=MB', location: 'London, UK', industry: 'Legal Services' },
  { id: 'L041', name: 'Jessica Davis', company: 'FitLife Gyms', email: 'jessica.davis@fitlife.com', status: 'Contacted', lastContact: format(new Date(2024, 0, 29), "yyyy-MM-dd"), website: 'https://fitlife.com', title: 'Personal Trainer', phone: '(555) 678-6677', avatar: 'https://placehold.co/40x40.png?text=JD', location: 'Sydney, AU', industry: 'Fitness' },
  { id: 'L042', name: 'Christopher Garcia', company: 'Artisan Crafts Co.', email: 'christopher.garcia@artisancrafts.com', status: 'Qualified', lastContact: format(new Date(2024, 1, 3), "yyyy-MM-dd"), website: 'https://artisancrafts.com', title: 'Artisan', phone: '(555) 789-7788', avatar: 'https://placehold.co/40x40.png?text=CG', location: 'Portland, OR', industry: 'Arts & Crafts' },
  { id: 'L043', name: 'Amanda Wilson', company: 'EventPlanners Pro', email: 'amanda.wilson@eventplanners.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 2, 16), "yyyy-MM-dd"), website: 'https://eventplanners.com', title: 'Event Coordinator', phone: '(555) 890-8899', avatar: 'https://placehold.co/40x40.png?text=AW', location: 'Las Vegas, NV', industry: 'Event Planning' },
  { id: 'L044', name: 'Kevin Rodriguez', company: 'GreenThumb Landscaping', email: 'kevin.rodriguez@greenthumb.com', status: 'New', lastContact: format(new Date(2024, 3, 20), "yyyy-MM-dd"), website: 'https://greenthumb.com', title: 'Landscaper', phone: '(555) 901-9900', avatar: 'https://placehold.co/40x40.png?text=KR', location: 'Austin, TX', industry: 'Landscaping' },
  { id: 'L045', name: 'Sarah Lee', company: 'ChefExpress Catering', email: 'sarah.lee@chefexpress.com', status: 'Contacted', lastContact: format(new Date(2024, 4, 25), "yyyy-MM-dd"), website: 'https://chefexpress.com', title: 'Catering Manager', phone: '(555) 012-0011', avatar: 'https://placehold.co/40x40.png?text=SL', location: 'New Orleans, LA', industry: 'Food & Beverage' },
  { id: 'L046', name: 'Brian Miller', company: 'AlphaMusic Studios', email: 'brian.miller@alphamusic.com', status: 'Qualified', lastContact: format(new Date(2024, 0, 12), "yyyy-MM-dd"), website: 'https://alphamusic.com', title: 'Music Producer', phone: '(555) 112-1122', avatar: 'https://placehold.co/40x40.png?text=BM', location: 'Nashville, TN', industry: 'Music Production' },
  { id: 'L047', name: 'Laura Wilson', company: 'BetaConsulting Group', email: 'laura.wilson@betaconsulting.com', status: 'Proposal Sent', lastContact: format(new Date(2024, 1, 19), "yyyy-MM-dd"), website: 'https://betaconsulting.com', title: 'Management Consultant', phone: '(555) 223-2233', avatar: 'https://placehold.co/40x40.png?text=LW', location: 'Chicago, IL', industry: 'Consulting' },
  { id: 'L048', name: 'Daniel Chen', company: 'GammaTech Innovations', email: 'daniel.chen@gammatech.com', status: 'New', lastContact: format(new Date(2024, 2, 28), "yyyy-MM-dd"), website: 'https://gammatech.com', title: 'Software Developer', phone: '(555) 334-3344', avatar: 'https://placehold.co/40x40.png?text=DC', location: 'San Jose, CA', industry: 'Software' },
  { id: 'L049', name: 'Megan Taylor', company: 'DeltaSolutions Co.', email: 'megan.taylor@deltasolutions.com', status: 'Contacted', lastContact: format(new Date(2024, 3, 8), "yyyy-MM-dd"), website: 'https://deltasolutions.com', title: 'Business Analyst', phone: '(555) 445-4455', avatar: 'https://placehold.co/40x40.png?text=MT', location: 'Boston, MA', industry: 'Business Services' },
  { id: 'L050', name: 'Robert Brown', company: 'EpsilonEnergy Ltd.', email: 'robert.brown@epsilonenergy.com', status: 'Qualified', lastContact: format(new Date(2024, 4, 14), "yyyy-MM-dd"), website: 'https://epsilonenergy.com', title: 'Energy Analyst', phone: '(555) 556-5566', avatar: 'https://placehold.co/40x40.png?text=RB', location: 'Houston, TX', industry: 'Energy' },
];


const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';
const LOCAL_STORAGE_KEY_CHATS = 'chatsData';
const LOCAL_STORAGE_KEY_MEETINGS = 'meetingsData';


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
  const [isViewLeadOpen, setIsViewLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // State for new filters
  const [nameFilter, setNameFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [keywordFilterText, setKeywordFilterText] = useState("");

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
      location: "",
      industry: "",
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
    const updatedLeads = [newLead, ...leads]; // Add to top
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
      // ensure avatar is updated if name changes, or keep existing if name doesn't change
      avatar: values.name === selectedLead.name ? selectedLead.avatar : `https://placehold.co/40x40.png?text=${values.name.split(' ').map(n=>n[0]).join('').toUpperCase()}`
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
        location: lead.location || "",
        industry: lead.industry || "",
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
      id: `CHAT-${Date.now()}`,
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
      id: `MEET-${Date.now()}`,
      title: `Meeting with ${lead.name} (${lead.company})`,
      type: 'Video Call',
      dateTime: format(new Date(new Date().setDate(new Date().getDate() + 1)), "PPpp"),
      status: 'Scheduled',
      participants: ['You', lead.name],
      googleMeetLink: 'https://meet.google.com/new',
    };
    const updatedMeetings = [newMeeting, ...currentMeetings];
    localStorage.setItem(LOCAL_STORAGE_KEY_MEETINGS, JSON.stringify(updatedMeetings));
    toast({ title: "Meeting Scheduled", description: `Meeting with ${lead.name} scheduled. Redirecting...` });
    router.push('/communications?tab=meetings');
  };

  const handleAddToCampaign = () => toast({ title: "Add to Campaign", description: "Functionality to add to campaign coming soon!" });


  const parseCSVToLeads = (csvText: string): Lead[] => {
    const newLeadsFromCsv: Lead[] = [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      toast({ title: "CSV Import Error", description: "CSV file is empty or has no data rows. It must have a header row and at least one data row.", variant: "destructive" });
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'company', 'email'];
    const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

    if (missingHeaders.length > 0) {
      toast({ title: "CSV Import Error", description: `Missing required columns: ${missingHeaders.join(', ')}. Expected at least: name, company, email. Optional: status, website, title, phone, location, industry.`, variant: "destructive" });
      return [];
    }

    const nameIndex = headers.indexOf('name');
    const companyIndex = headers.indexOf('company');
    const emailIndex = headers.indexOf('email');
    const statusIndex = headers.indexOf('status');
    const websiteIndex = headers.indexOf('website');
    const titleIndex = headers.indexOf('title');
    const phoneIndex = headers.indexOf('phone');
    const locationIndex = headers.indexOf('location');
    const industryIndex = headers.indexOf('industry');


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
      const leadStatus = leadStatuses.includes(statusValue as Lead['status']) ? statusValue as Lead['status'] : "New";

      const lead: Lead = {
        id: `L${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name,
        company,
        email,
        status: leadStatus,
        website: websiteIndex > -1 && values[websiteIndex] ? values[websiteIndex] : undefined,
        title: titleIndex > -1 && values[titleIndex] ? values[titleIndex] : undefined,
        phone: phoneIndex > -1 && values[phoneIndex] ? values[phoneIndex] : undefined,
        location: locationIndex > -1 && values[locationIndex] ? values[locationIndex] : undefined,
        industry: industryIndex > -1 && values[industryIndex] ? values[industryIndex] : undefined,
        lastContact: format(new Date(), "yyyy-MM-dd"),
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
          const updatedLeads = [...parsedLeads, ...leads]; // Add new leads to the top
          setLeads(updatedLeads);
          saveLeadsToLocalStorage(updatedLeads);
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

    if (event.target) event.target.value = "";
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectRow = (leadId: string, checked: boolean) => {
    setSelectedRows(prev => ({ ...prev, [leadId]: checked }));
  };

  const filteredLeads = useMemo(() => {
    let tempLeads = leads;

    if (statusFilter !== "All") {
      tempLeads = tempLeads.filter(lead => lead.status === statusFilter);
    }
    if (nameFilter) {
      tempLeads = tempLeads.filter(lead => lead.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (titleFilter) {
      tempLeads = tempLeads.filter(lead => lead.title?.toLowerCase().includes(titleFilter.toLowerCase()));
    }
    if (locationFilter) {
      tempLeads = tempLeads.filter(lead => lead.location?.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (industryFilter) {
      tempLeads = tempLeads.filter(lead => lead.industry?.toLowerCase().includes(industryFilter.toLowerCase()));
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
  }, [leads, statusFilter, nameFilter, titleFilter, locationFilter, industryFilter, keywordFilterText]);


  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every(lead => selectedRows[lead.id]);

  const handleSelectAllRows = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    if (checked) {
      filteredLeads.forEach(lead => newSelectedRows[lead.id] = true);
    }
    setSelectedRows(newSelectedRows);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "All") count++;
    if (nameFilter) count++;
    if (titleFilter) count++;
    if (locationFilter) count++;
    if (industryFilter) count++;
    if (keywordFilterText) count++;
    return count;
  }, [statusFilter, nameFilter, titleFilter, locationFilter, industryFilter, keywordFilterText]);

  const handleClearFilters = () => {
    setStatusFilter("All");
    setNameFilter("");
    setTitleFilter("");
    setLocationFilter("");
    setIndustryFilter("");
    setKeywordFilterText("");
    toast({ title: "Filters Cleared", description: "All active filters have been reset." });
  };

  const handleApplyFilters = () => {
     toast({ title: "Filters Applied", description: "Live filtering is active. Results are updated as you type." });
  };


  return (
    <MainLayout>
      <div className="h-full flex flex-col flex-grow flex overflow-hidden">
        {/* Filters Sidebar */}
        <ScrollArea className="w-72 border-r bg-card p-4 hidden md:block">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Save Filters", description: "Functionality coming soon!"})}>
                  <ListFilter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClearFilters}>
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
                ) : section.id === 'name' ? (
                    <Input placeholder={section.placeholder} className="h-9" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                ) : section.id === 'title' ? (
                    <Input placeholder={section.placeholder} className="h-9" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} />
                ) : section.id === 'location' ? (
                    <Input placeholder={section.placeholder} className="h-9" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                ) : section.id === 'industry' ? (
                    <Input placeholder={section.placeholder} className="h-9" value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} />
                ) : section.id === 'keywordFilter' ? (
                    <Input placeholder={section.placeholder} className="h-9" value={keywordFilterText} onChange={(e) => setKeywordFilterText(e.target.value)} />
                ) : (
                    <Input placeholder={section.placeholder} className="h-9" disabled/>
                )}
              </div>
            ))}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
                Clear ({activeFilterCount})
              </Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={handleApplyFilters}>
                Apply Filter
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6 overflow-x-auto">
          <h1 className="text-2xl font-semibold text-foreground mb-6">People</h1>
          <div className="flex justify-between items-center mb-4 gap-2">
             {/* Placeholder for AI Lead Finder or other content above buttons if needed */}
             <div></div>
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
                        <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location (Optional)</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry (Optional)</FormLabel><FormControl><Input placeholder="e.g., Technology" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                            <AvatarImage src={lead.avatar || `https://placehold.co/40x40.png?text=${lead.name.split(' ').map(n=>n[0]).join('').toUpperCase()}`} alt={lead.name} data-ai-hint="person avatar"/>
                            <AvatarFallback>{lead.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{lead.name}</span>
                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="View on LinkedIn">
                            <Linkedin className="h-4 w-4 text-blue-600 cursor-pointer hover:text-blue-700" />
                          </a>
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
            <div>Pages 1 of {Math.ceil(filteredLeads.length / 10)} pages</div>
          </div>
        </div>
      </div>

      {/* Add Lead Dialog (now "Add to List") */}
       <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
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
                      <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location (Optional)</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry (Optional)</FormLabel><FormControl><Input placeholder="e.g., Technology" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                      <FormField control={editForm.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={editForm.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                      <p><strong>Location:</strong> {selectedLead.location || 'N/A'}</p>
                      <p><strong>Industry:</strong> {selectedLead.industry || 'N/A'}</p>
                      <p><strong>Status:</strong> <Badge variant={statusVariantMap[selectedLead.status]}>{selectedLead.status}</Badge></p>
                      <p><strong>Last Contact:</strong> {selectedLead.lastContact ? format(parseISO(selectedLead.lastContact), "PPP") : 'N/A'}</p>
                  </div>
              )}
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewLeadOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </MainLayout>
  );
}
