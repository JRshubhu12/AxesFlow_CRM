"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Plus,
  Linkedin,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Download,
  Search,
  Bookmark,
  X,
  User,
  Briefcase,
  MapPin,
  Building2,
  Users as UsersIcon,
  DollarSign,
  GraduationCap,
  Link2,
  AtSign,
  Layers,
  Settings
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from "@/components/ui/badge";

// --------- ChipsField helper with black option badges ---------
function ChipsField({ label, icon, options, values, setValues, placeholder = '', allowCustom = false }: {
  label: string;
  icon: React.ReactNode;
  options: string[];
  values: string[];
  setValues: (v: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const [input, setInput] = useState("");
  function addChip(val: string) {
    if (val && !values.includes(val)) setValues([...values, val]);
    setInput("");
  }
  function removeChip(val: string) {
    setValues(values.filter(v => v !== val));
  }
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1 font-medium text-sm text-muted-foreground">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-1 mb-1">
        {values.map(v => (
          <Badge key={v} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1">
            {v}
            <button type="button" onClick={() => removeChip(v)} className="ml-1 focus:outline-none">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          className="h-7 w-full"
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              addChip(input.trim());
              e.preventDefault();
            }
          }}
        />
        {options.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {options.filter(opt => !values.includes(opt)).map(opt => (
              <Badge
                key={opt}
                className="cursor-pointer bg-black text-white px-2 py-1 text-xs"
                onClick={() => addChip(opt)}
              >
                {opt}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------- Schema/types/constants -----------
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
const statusColors: Record<Lead["status"], string> = {
  "New": "bg-blue-100 text-blue-700",
  "Contacted": "bg-yellow-100 text-yellow-700",
  "Qualified": "bg-green-100 text-green-700",
  "Proposal Sent": "bg-indigo-100 text-indigo-700",
  "Closed - Won": "bg-emerald-100 text-emerald-700",
  "Closed - Lost": "bg-red-100 text-red-700",
};
const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';

const initialLeadsData: Lead[] = [
  { id: 'L001', name: 'Ronald Richards', company: 'Astor Medical', email: 'darrellsteward@gmail.com', status: 'New', lastContact: '2024-05-20T10:00:00Z', title: 'Founder & CEO', phone: '(202) 555-0121', avatar: 'https://placehold.co/40x40.png?text=RR', location: 'New York, NY', industry: 'Healthcare', website: 'https://astormedical.com', linkedin_url: 'https://linkedin.com/in/ronaldrichards' },
  { id: 'L002', name: 'Courtney Henry', company: 'Big Kahuna Burger Ltd.', email: 'marvinmckinney@gmail.com', status: 'Contacted', lastContact: '2024-05-22T11:30:00Z', title: 'CEO', phone: '(308) 555-0111', avatar: 'https://placehold.co/40x40.png?text=CH', location: 'Los Angeles, CA', industry: 'Food & Beverage', website: 'https://bigkahunaburger.com', linkedin_url: 'https://linkedin.com/in/courtneyhenry' },
  { id: 'L003', name: 'Annette Black', company: 'Astra Payroll Services', email: 'ralphralphsw@gmail.com', status: 'Qualified', lastContact: '2024-05-15T14:00:00Z', title: 'Founder & CEO', phone: '(620) 555-0128', avatar: 'https://placehold.co/40x40.png?text=AB', location: 'Chicago, IL', industry: 'Financial Services', website: 'https://astrapayroll.com', linkedin_url: 'https://linkedin.com/in/annetteblack' },
  { id: 'L004', name: 'Cameron Williamson', company: 'Commonwealth Payroll', email: 'janecooper@gmail.com', status: 'Proposal Sent', lastContact: '2024-05-10T09:00:00Z', title: 'Founder & CEO', phone: '(252) 555-0153', avatar: 'https://placehold.co/40x40.png?text=CW', location: 'Boston, MA', industry: 'Financial Services', website: 'https://commonwealthpayroll.com', linkedin_url: 'https://linkedin.com/in/cameronwilliamson' },
  { id: 'L005', name: 'Brooklyn Simmons', company: 'Acme Co.', email: 'clevecleme@gmail.com', status: 'Closed - Won', lastContact: '2024-04-28T16:00:00Z', title: 'CEO', phone: '(208) 555-0106', avatar: 'https://placehold.co/40x40.png?text=BS', location: 'Austin, TX', industry: 'Technology', website: 'https://acmeco.com', linkedin_url: 'https://linkedin.com/in/brooklynsimmons' },
  { id: 'L006', name: 'Eleanor Pena', company: 'SoftLayer, an IBM Company', email: 'wadebwarre@gmail.com', status: 'New', lastContact: '2024-05-25T10:00:00Z', title: 'CTO', phone: '(270) 555-0117', avatar: 'https://placehold.co/40x40.png?text=EP', location: 'Dallas, TX', industry: 'Cloud Computing', website: 'https://softlayer.com', linkedin_url: 'https://linkedin.com/in/eleanorpena' },
  { id: 'L007', name: 'Theresa Webb', company: 'Binford Ltd.', email: 'floyedmiled@gmail.com', status: 'Contacted', lastContact: '2024-05-24T11:30:00Z', title: 'Marketing Director', phone: '(239) 555-0108', avatar: 'https://placehold.co/40x40.png?text=TW', location: 'Detroit, MI', industry: 'Manufacturing', website: 'https://binford.com', linkedin_url: 'https://linkedin.com/in/theresawebb' },
  { id: 'L008', name: 'Kathryn Murphy', company: 'Wells Fargo Advisors', email: 'diannerussue@gmail.com', status: 'Qualified', lastContact: '2024-05-23T14:00:00Z', title: 'Financial Advisor', phone: '(207) 555-0112', avatar: 'https://placehold.co/40x40.png?text=KM', location: 'San Francisco, CA', industry: 'Banking', website: 'https://wellsfargoadvisors.com', linkedin_url: 'https://linkedin.com/in/kathrynmurphy' },
  { id: 'L009', name: 'Darrell Steward', company: 'Innovatech Solutions', email: 'lesliealexander@gmail.com', status: 'Proposal Sent', lastContact: '2024-05-22T09:00:00Z', title: 'Sales Manager', phone: '(303) 555-0121', avatar: 'https://placehold.co/40x40.png?text=DS', location: 'Denver, CO', industry: 'IT Services', website: 'https://innovatech.com', linkedin_url: 'https://linkedin.com/in/darrellsteward' },
  { id: 'L010', name: 'Marvin McKinney', company: 'The Kraft Heinz Company', email: 'devenlane@gmail.com', status: 'New', lastContact: '2024-05-21T16:00:00Z', title: 'Brand Manager', phone: '(904) 555-0199', avatar: 'https://placehold.co/40x40.png?text=MM', location: 'Chicago, IL', industry: 'Food Production', website: 'https://kraftheinz.com', linkedin_url: 'https://linkedin.com/in/marvinmckinney' },
  { id: 'L011', name: 'Guy Hawkins', company: 'Stark Industries', email: 'guyhawkins@gmail.com', status: 'Contacted', lastContact: '2024-05-18T13:00:00Z', title: 'Operations Lead', phone: '(870) 555-0181', avatar: 'https://placehold.co/40x40.png?text=GH', location: 'Newark, NJ', industry: 'Engineering', website: 'https://starkindustries.com', linkedin_url: 'https://linkedin.com/in/guyhawkins' },
  { id: 'L012', name: 'Jane Cooper', company: 'Umbrella Corp.', email: 'janecooper@gmail.com', status: 'Closed - Lost', lastContact: '2024-05-16T10:00:00Z', title: 'Director', phone: '(201) 555-0159', avatar: 'https://placehold.co/40x40.png?text=JC', location: 'Seattle, WA', industry: 'Pharmaceuticals', website: 'https://umbrella.com', linkedin_url: 'https://linkedin.com/in/janecooper' },
  { id: 'L013', name: 'Arlene McCoy', company: 'Rundex Family Limited', email: 'arlenemc@gmail.com', status: 'Contacted', lastContact: '2024-05-19T13:00:00Z', title: 'COO', phone: '(212) 555-0113', avatar: 'https://placehold.co/40x40.png?text=AM', location: 'Houston, TX', industry: 'Retail', website: 'https://rundexfamily.com', linkedin_url: 'https://linkedin.com/in/arlenemccoy' },
  { id: 'L014', name: 'Wade Warren', company: 'Cyberdyne Systems', email: 'wadewarren@gmail.com', status: 'New', lastContact: '2024-05-11T09:30:00Z', title: 'CTO', phone: '(301) 555-0100', avatar: 'https://placehold.co/40x40.png?text=WW', location: 'Sunnyvale, CA', industry: 'Robotics', website: 'https://cyberdynesystems.com', linkedin_url: 'https://linkedin.com/in/wadewarren' },
  { id: 'L015', name: 'Dianne Russell', company: 'Oscorp', email: 'dianne.russell@gmail.com', status: 'Qualified', lastContact: '2024-05-10T11:00:00Z', title: 'VP Sales', phone: '(205) 555-0112', avatar: 'https://placehold.co/40x40.png?text=DR', location: 'New York, NY', industry: 'Biotech', website: 'https://oscorp.com', linkedin_url: 'https://linkedin.com/in/diannerussell' },
  { id: 'L016', name: 'Ralph Edwards', company: 'Globex Corporation', email: 'ralphedwards@gmail.com', status: 'Contacted', lastContact: '2024-05-12T14:00:00Z', title: 'Managing Director', phone: '(214) 555-0168', avatar: 'https://placehold.co/40x40.png?text=RE', location: 'Dallas, TX', industry: 'Finance', website: 'https://globex.com', linkedin_url: 'https://linkedin.com/in/ralphedwards' },
  { id: 'L017', name: 'Floyd Miles', company: 'Soylent Corp.', email: 'floydmiles@gmail.com', status: 'Proposal Sent', lastContact: '2024-05-09T10:00:00Z', title: 'CEO', phone: '(215) 555-0172', avatar: 'https://placehold.co/40x40.png?text=FM', location: 'Philadelphia, PA', industry: 'Food Production', website: 'https://soylent.com', linkedin_url: 'https://linkedin.com/in/floydmiles' },
  { id: 'L018', name: 'Esther Howard', company: 'Initech', email: 'estherhoward@gmail.com', status: 'Qualified', lastContact: '2024-05-14T13:00:00Z', title: 'CFO', phone: '(210) 555-0178', avatar: 'https://placehold.co/40x40.png?text=EH', location: 'San Antonio, TX', industry: 'Software', website: 'https://initech.com', linkedin_url: 'https://linkedin.com/in/estherhoward' },
  { id: 'L019', name: 'Savannah Nguyen', company: 'Hooli', email: 'savannahnguyen@gmail.com', status: 'Closed - Lost', lastContact: '2024-05-08T15:00:00Z', title: 'VP Engineering', phone: '(650) 555-0193', avatar: 'https://placehold.co/40x40.png?text=SN', location: 'Palo Alto, CA', industry: 'Technology', website: 'https://hooli.com', linkedin_url: 'https://linkedin.com/in/savannahnguyen' },
  { id: 'L020', name: 'Jerome Bell', company: 'Vehement Capital Partners', email: 'jeromebell@gmail.com', status: 'Contacted', lastContact: '2024-05-17T14:00:00Z', title: 'Partner', phone: '(630) 555-0112', avatar: 'https://placehold.co/40x40.png?text=JB', location: 'Chicago, IL', industry: 'Investment', website: 'https://vehementpartners.com', linkedin_url: 'https://linkedin.com/in/jeromebell' },
  { id: 'L021', name: 'Estella Christensen', company: 'Massive Dynamic', email: 'estellac@gmail.com', status: 'New', lastContact: '2024-05-07T11:30:00Z', title: 'Chief Scientist', phone: '(720) 555-0178', avatar: 'https://placehold.co/40x40.png?text=EC', location: 'Boulder, CO', industry: 'Technology', website: 'https://massivedynamic.com', linkedin_url: 'https://linkedin.com/in/estellachristensen' },
  { id: 'L022', name: 'Cody Fisher', company: 'Wayne Enterprises', email: 'codyfisher@gmail.com', status: 'Contacted', lastContact: '2024-05-06T09:30:00Z', title: 'COO', phone: '(818) 555-0117', avatar: 'https://placehold.co/40x40.png?text=CF', location: 'Gotham, NY', industry: 'Conglomerate', website: 'https://wayneenterprises.com', linkedin_url: 'https://linkedin.com/in/codyfisher' },
  { id: 'L023', name: 'Kristin Watson', company: 'Wonka Industries', email: 'kristinwatson@gmail.com', status: 'Qualified', lastContact: '2024-05-05T12:30:00Z', title: 'Head of R&D', phone: '(810) 555-0183', avatar: 'https://placehold.co/40x40.png?text=KW', location: 'Scranton, PA', industry: 'Confectionery', website: 'https://wonka.com', linkedin_url: 'https://linkedin.com/in/kristinwatson' },
  { id: 'L024', name: 'Devon Lane', company: 'Globex Corporation', email: 'devonlane@gmail.com', status: 'Proposal Sent', lastContact: '2024-05-04T16:00:00Z', title: 'VP Product', phone: '(703) 555-0135', avatar: 'https://placehold.co/40x40.png?text=DL', location: 'Arlington, VA', industry: 'Finance', website: 'https://globex.com', linkedin_url: 'https://linkedin.com/in/devonlane' },
  { id: 'L025', name: 'Kathleen McCoy', company: 'Duff Beer', email: 'kathleenmccoy@gmail.com', status: 'Closed - Won', lastContact: '2024-05-03T11:00:00Z', title: 'President', phone: '(913) 555-0187', avatar: 'https://placehold.co/40x40.png?text=KM', location: 'Springfield, IL', industry: 'Beverages', website: 'https://duffbeer.com', linkedin_url: 'https://linkedin.com/in/kathleenmccoy' },
  { id: 'L026', name: 'Albert Flores', company: 'Acme Widgets', email: 'albertflores@gmail.com', status: 'New', lastContact: '2024-05-02T09:00:00Z', title: 'Head of Engineering', phone: '(708) 555-0179', avatar: 'https://placehold.co/40x40.png?text=AF', location: 'Naperville, IL', industry: 'Manufacturing', website: 'https://acmewidgets.com', linkedin_url: 'https://linkedin.com/in/albertflores' },
  { id: 'L027', name: 'Debra Holt', company: 'Soylent Corp.', email: 'debraholt@gmail.com', status: 'Qualified', lastContact: '2024-05-01T13:00:00Z', title: 'R&D Manager', phone: '(405) 555-0133', avatar: 'https://placehold.co/40x40.png?text=DH', location: 'Oklahoma City, OK', industry: 'Food Production', website: 'https://soylent.com', linkedin_url: 'https://linkedin.com/in/debraholt' },
  { id: 'L028', name: 'Robert Fox', company: 'Hooli', email: 'robertfox@gmail.com', status: 'Contacted', lastContact: '2024-04-30T15:30:00Z', title: 'VP Operations', phone: '(415) 555-0124', avatar: 'https://placehold.co/40x40.png?text=RF', location: 'San Jose, CA', industry: 'Technology', website: 'https://hooli.com', linkedin_url: 'https://linkedin.com/in/robertfox' },
  { id: 'L029', name: 'Jacob Jones', company: 'Initech', email: 'jacobjones@gmail.com', status: 'Proposal Sent', lastContact: '2024-04-29T10:00:00Z', title: 'Account Manager', phone: '(619) 555-0162', avatar: 'https://placehold.co/40x40.png?text=JJ', location: 'San Diego, CA', industry: 'Software', website: 'https://initech.com', linkedin_url: 'https://linkedin.com/in/jacobjones' },
  { id: 'L030', name: 'Leslie Alexander', company: 'Binford Ltd.', email: 'lesliealexander2@gmail.com', status: 'Closed - Won', lastContact: '2024-04-28T11:30:00Z', title: 'Sales Lead', phone: '(720) 555-0145', avatar: 'https://placehold.co/40x40.png?text=LA', location: 'Denver, CO', industry: 'Manufacturing', website: 'https://binford.com', linkedin_url: 'https://linkedin.com/in/lesliealexander' },
  { id: 'L031', name: 'Jenny Wilson', company: 'Oscorp', email: 'jennywilson@gmail.com', status: 'Contacted', lastContact: '2024-04-27T09:00:00Z', title: 'VP HR', phone: '(318) 555-0182', avatar: 'https://placehold.co/40x40.png?text=JW', location: 'Baton Rouge, LA', industry: 'Biotech', website: 'https://oscorp.com', linkedin_url: 'https://linkedin.com/in/jennywilson' },
  { id: 'L032', name: 'Evan Torres', company: 'Massive Dynamic', email: 'evantorres@gmail.com', status: 'New', lastContact: '2024-04-26T16:00:00Z', title: 'Head of AI', phone: '(212) 555-0168', avatar: 'https://placehold.co/40x40.png?text=ET', location: 'New York, NY', industry: 'Technology', website: 'https://massivedynamic.com', linkedin_url: 'https://linkedin.com/in/evantorres' },
  { id: 'L033', name: 'Paige Turner', company: 'Duff Beer', email: 'paigeturner@gmail.com', status: 'Qualified', lastContact: '2024-04-25T13:00:00Z', title: 'Head of Marketing', phone: '(314) 555-0191', avatar: 'https://placehold.co/40x40.png?text=PT', location: 'St. Louis, MO', industry: 'Beverages', website: 'https://duffbeer.com', linkedin_url: 'https://linkedin.com/in/paigeturner' },
  { id: 'L034', name: 'Megan James', company: 'Stark Industries', email: 'meganjames@gmail.com', status: 'Contacted', lastContact: '2024-04-24T14:00:00Z', title: 'Chief Designer', phone: '(609) 555-0143', avatar: 'https://placehold.co/40x40.png?text=MJ', location: 'Trenton, NJ', industry: 'Engineering', website: 'https://starkindustries.com', linkedin_url: 'https://linkedin.com/in/meganjames' },
  { id: 'L035', name: 'Ava Daniels', company: 'Acme Widgets', email: 'avadaniels@gmail.com', status: 'New', lastContact: '2024-04-23T12:00:00Z', title: 'Product Lead', phone: '(309) 555-0193', avatar: 'https://placehold.co/40x40.png?text=AD', location: 'Peoria, IL', industry: 'Manufacturing', website: 'https://acmewidgets.com', linkedin_url: 'https://linkedin.com/in/avadaniels' },
  { id: 'L036', name: 'Chelsea Foster', company: 'Astor Medical', email: 'chelseafoster@gmail.com', status: 'Qualified', lastContact: '2024-04-22T10:00:00Z', title: 'Operations Director', phone: '(573) 555-0198', avatar: 'https://placehold.co/40x40.png?text=CF', location: 'St. Louis, MO', industry: 'Healthcare', website: 'https://astormedical.com', linkedin_url: 'https://linkedin.com/in/chelseafoster' },
  { id: 'L037', name: 'Bruce Wayne', company: 'Wayne Enterprises', email: 'brucewayne@gmail.com', status: 'Contacted', lastContact: '2024-04-21T13:00:00Z', title: 'Chairman', phone: '(212) 555-0155', avatar: 'https://placehold.co/40x40.png?text=BW', location: 'Gotham, NY', industry: 'Conglomerate', website: 'https://wayneenterprises.com', linkedin_url: 'https://linkedin.com/in/brucewayne' },
  { id: 'L038', name: 'Tina Chen', company: 'Big Kahuna Burger Ltd.', email: 'tinachen@gmail.com', status: 'Closed - Won', lastContact: '2024-04-20T14:00:00Z', title: 'VP Operations', phone: '(916) 555-0188', avatar: 'https://placehold.co/40x40.png?text=TC', location: 'Sacramento, CA', industry: 'Food & Beverage', website: 'https://bigkahunaburger.com', linkedin_url: 'https://linkedin.com/in/tinachen' },
  { id: 'L039', name: 'Sophie Lee', company: 'The Kraft Heinz Company', email: 'sophielee@gmail.com', status: 'Proposal Sent', lastContact: '2024-04-19T15:00:00Z', title: 'Head of Logistics', phone: '(773) 555-0189', avatar: 'https://placehold.co/40x40.png?text=SL', location: 'Chicago, IL', industry: 'Food Production', website: 'https://kraftheinz.com', linkedin_url: 'https://linkedin.com/in/sophielee' },
  { id: 'L040', name: 'Lucas Gray', company: 'SoftLayer, an IBM Company', email: 'lucasgray@gmail.com', status: 'Qualified', lastContact: '2024-04-18T11:00:00Z', title: 'Cloud Architect', phone: '(512) 555-0177', avatar: 'https://placehold.co/40x40.png?text=LG', location: 'Austin, TX', industry: 'Cloud Computing', website: 'https://softlayer.com', linkedin_url: 'https://linkedin.com/in/lucasgray' },
  { id: 'L041', name: 'Maya Patel', company: 'Commonwealth Payroll', email: 'mayapatel@gmail.com', status: 'Contacted', lastContact: '2024-04-17T16:00:00Z', title: 'Account Executive', phone: '(617) 555-0197', avatar: 'https://placehold.co/40x40.png?text=MP', location: 'Boston, MA', industry: 'Financial Services', website: 'https://commonwealthpayroll.com', linkedin_url: 'https://linkedin.com/in/mayapatel' },
  { id: 'L042', name: 'Julian Grant', company: 'Innovatech Solutions', email: 'juliangrant@gmail.com', status: 'New', lastContact: '2024-04-16T10:00:00Z', title: 'Lead Developer', phone: '(303) 555-0198', avatar: 'https://placehold.co/40x40.png?text=JG', location: 'Denver, CO', industry: 'IT Services', website: 'https://innovatech.com', linkedin_url: 'https://linkedin.com/in/juliangrant' },
  { id: 'L043', name: 'Martha Stewart', company: 'Acme Co.', email: 'marthastewart@gmail.com', status: 'Contacted', lastContact: '2024-04-15T12:00:00Z', title: 'VP Marketing', phone: '(210) 555-0132', avatar: 'https://placehold.co/40x40.png?text=MS', location: 'Dallas, TX', industry: 'Technology', website: 'https://acmeco.com', linkedin_url: 'https://linkedin.com/in/marthastewart' },
  { id: 'L044', name: 'Samuel Price', company: 'Astor Medical', email: 'samuelprice@gmail.com', status: 'Qualified', lastContact: '2024-04-14T11:00:00Z', title: 'Business Analyst', phone: '(314) 555-0152', avatar: 'https://placehold.co/40x40.png?text=SP', location: 'St. Louis, MO', industry: 'Healthcare', website: 'https://astormedical.com', linkedin_url: 'https://linkedin.com/in/samuelprice' },
  { id: 'L045', name: 'Julia Roberts', company: 'Big Kahuna Burger Ltd.', email: 'juliaroberts@gmail.com', status: 'Closed - Lost', lastContact: '2024-04-13T13:00:00Z', title: 'CFO', phone: '(212) 555-0199', avatar: 'https://placehold.co/40x40.png?text=JR', location: 'Los Angeles, CA', industry: 'Food & Beverage', website: 'https://bigkahunaburger.com', linkedin_url: 'https://linkedin.com/in/juliaroberts' },
  { id: 'L046', name: 'Henry Miles', company: 'Binford Ltd.', email: 'henrymiles@gmail.com', status: 'Proposal Sent', lastContact: '2024-04-12T15:00:00Z', title: 'Senior Engineer', phone: '(231) 555-0123', avatar: 'https://placehold.co/40x40.png?text=HM', location: 'Detroit, MI', industry: 'Manufacturing', website: 'https://binford.com', linkedin_url: 'https://linkedin.com/in/henrymiles' },
  { id: 'L047', name: 'Rachel Adams', company: 'Wells Fargo Advisors', email: 'racheladams@gmail.com', status: 'Contacted', lastContact: '2024-04-11T11:00:00Z', title: 'Financial Consultant', phone: '(206) 555-0192', avatar: 'https://placehold.co/40x40.png?text=RA', location: 'Seattle, WA', industry: 'Banking', website: 'https://wellsfargoadvisors.com', linkedin_url: 'https://linkedin.com/in/racheladams' },
  { id: 'L048', name: 'Sasha Brown', company: 'Astra Payroll Services', email: 'sashabrown@gmail.com', status: 'Closed - Won', lastContact: '2024-04-10T10:00:00Z', title: 'Head of Payroll', phone: '(312) 555-0181', avatar: 'https://placehold.co/40x40.png?text=SB', location: 'Chicago, IL', industry: 'Financial Services', website: 'https://astrapayroll.com', linkedin_url: 'https://linkedin.com/in/sashabrown' },
  { id: 'L049', name: 'Peter Clark', company: 'Commonwealth Payroll', email: 'peterclark@gmail.com', status: 'Contacted', lastContact: '2024-04-09T12:00:00Z', title: 'Staff Accountant', phone: '(617) 555-0196', avatar: 'https://placehold.co/40x40.png?text=PC', location: 'Boston, MA', industry: 'Financial Services', website: 'https://commonwealthpayroll.com', linkedin_url: 'https://linkedin.com/in/peterclark' },
  { id: 'L050', name: 'Linda White', company: 'Innovatech Solutions', email: 'lindawhite@gmail.com', status: 'New', lastContact: '2024-04-08T14:00:00Z', title: 'Product Manager', phone: '(303) 555-0195', avatar: 'https://placehold.co/40x40.png?text=LW', location: 'Denver, CO', industry: 'IT Services', website: 'https://innovatech.com', linkedin_url: 'https://linkedin.com/in/lindawhite' },
];

// export default initialLeadsData;

// ----------- Main Component -----------
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Control: number of visible leads (scrollable view)
  const [viewAll, setViewAll] = useState(false);
  const LEADS_TO_SHOW = 5;

  // Find Leads/Import CSV UI state
  const [isFindPopoverOpen, setIsFindPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<'All' | Lead['status']>('All');

  // --- Find Leads filter states ---
  const [findName, setFindName] = useState("");
  const [findTitles, setFindTitles] = useState<string[]>([]);
  const [findLocations, setFindLocations] = useState<string[]>([]);
  const [findIndustries, setFindIndustries] = useState<string[]>([]);
  const [findEmployeeSizes, setFindEmployeeSizes] = useState<string[]>([]);
  const [findRevenues, setFindRevenues] = useState<string[]>([]);
  const [findKeywords, setFindKeywords] = useState<string[]>([]);
  const [findDegrees, setFindDegrees] = useState<string[]>([]);
  const [findTechnology, setFindTechnology] = useState("");
  const [findContactInfo, setFindContactInfo] = useState("");
  const [findSocial, setFindSocial] = useState("");
  const [findSkills, setFindSkills] = useState("");
  const [findDepartments, setFindDepartments] = useState<string[]>([]);

  // Example filter options (replace with your options/data as needed)
  const titleOptions = ["Founder", "CEO", "Co-Founder", "CTO", "Marketing Director"];
  const locationOptions = ["USA", "India", "UK", "Canada"];
  const industryOptions = ["Healthcare", "Technology", "Financial Services", "Food & Beverage"];
  const employeeSizeOptions = ["0-25", "25-100", "100-500", "500+"];
  const revenueOptions = ["$1M-$10M", "$10M-$100M", "$100M+"];
  const degreeOptions = ["CSE", "MSC", "B.Tech", "MBA"];
  const departmentOptions = ["Engineering", "Sales", "Marketing", "HR"];

  // Count of active filters
  const findActiveCount = [
    findName, ...findTitles, ...findLocations, ...findIndustries, ...findEmployeeSizes, ...findRevenues, ...findKeywords, ...findDegrees, findTechnology, findContactInfo, findSocial, findSkills, ...findDepartments
  ].filter(Boolean).length;

  // Import CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    toast({ title: "Import coming soon" });
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  function handleImportClick() {
    fileInputRef.current?.click();
  }

  // Find Leads filter: Apply and Clear (no actual filtering here, just UI)
  function handleFindApply() {
    setIsFindPopoverOpen(false);
    toast({ title: "Filter applied", description: `${findActiveCount} filters active.` });
  }
  function handleFindClear() {
    setFindName(""); setFindTitles([]); setFindLocations([]); setFindIndustries([]); setFindEmployeeSizes([]);
    setFindRevenues([]); setFindKeywords([]); setFindDegrees([]);
    setFindTechnology(""); setFindContactInfo(""); setFindSocial(""); setFindSkills(""); setFindDepartments([]);
    toast({ title: "Filters cleared" });
  }

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

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "", company: "", email: "", status: "New", website: "", title: "", phone: "", location: "", industry: "", linkedin_url: ""
    },
  });

  const handleSelectAllRows = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    if (checked) {
      leads.forEach(lead => newSelectedRows[lead.id] = true);
    }
    setSelectedRows(newSelectedRows);
  };
  const isAllSelected = leads.length > 0 && leads.every(lead => selectedRows[lead.id]);

  // Only show 5 leads (or all if viewAll)
  let filteredLeads = statusFilter === 'All' ? leads : leads.filter(l => l.status === statusFilter);
  const visibleLeads = viewAll ? filteredLeads : filteredLeads.slice(0, LEADS_TO_SHOW);

  const statusPill = (status: Lead['status']) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>{status}</span>
  );

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="flex items-center justify-end gap-2 px-6 pt-8 pb-2">
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)} >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {leadStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Import CSV */}
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
          {/* Find Leads filter popover */}
          <Popover open={isFindPopoverOpen} onOpenChange={setIsFindPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9">
                <Search className="mr-2 h-4 w-4" /> Find Leads
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[370px] p-0 shadow-xl rounded-lg border overflow-auto max-h-[90vh]">
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
                <h3 className="text-base font-semibold">Find Leads</h3>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <PopoverClose asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </PopoverClose>
                </div>
              </div>
              <div className="p-4 pb-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Name" value={findName} onChange={e => setFindName(e.target.value)} className="border-none focus:ring-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                  </div>
                  <ChipsField
                    label="Title"
                    icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                    options={titleOptions}
                    values={findTitles}
                    setValues={setFindTitles}
                    placeholder="Title (e.g. Founder, CEO)"
                    allowCustom
                  />
                  <ChipsField
                    label="Location"
                    icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                    options={locationOptions}
                    values={findLocations}
                    setValues={setFindLocations}
                    placeholder="Location (e.g. USA)"
                    allowCustom
                  />
                  <ChipsField
                    label="Industry"
                    icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                    options={industryOptions}
                    values={findIndustries}
                    setValues={setFindIndustries}
                    placeholder="Industry"
                    allowCustom
                  />
                  <ChipsField
                    label="Employee Size"
                    icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
                    options={employeeSizeOptions}
                    values={findEmployeeSizes}
                    setValues={setFindEmployeeSizes}
                    placeholder="0-25, 25-100"
                  />
                  <ChipsField
                    label="Revenue"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    options={revenueOptions}
                    values={findRevenues}
                    setValues={setFindRevenues}
                    placeholder="$1M - $10M"
                  />
                  <ChipsField
                    label="Keyword Filter"
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                    options={[]}
                    values={findKeywords}
                    setValues={setFindKeywords}
                    placeholder="Keyword"
                    allowCustom
                  />
                  <ChipsField
                    label="Degree"
                    icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                    options={degreeOptions}
                    values={findDegrees}
                    setValues={setFindDegrees}
                    placeholder="e.g. CSE, MSC"
                    allowCustom
                  />
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Technology" value={findTechnology} onChange={e => setFindTechnology(e.target.value)} className="border-none focus:ring-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Contact Info" value={findContactInfo} onChange={e => setFindContactInfo(e.target.value)} className="border-none focus:ring-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Linkedin URL or Twitter" value={findSocial} onChange={e => setFindSocial(e.target.value)} className="border-none focus:ring-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Skills" value={findSkills} onChange={e => setFindSkills(e.target.value)} className="border-none focus:ring-0 h-auto p-0 bg-transparent placeholder:text-muted-foreground" />
                  </div>
                  <ChipsField
                    label="Department"
                    icon={<Layers className="h-4 w-4 text-muted-foreground" />}
                    options={departmentOptions}
                    values={findDepartments}
                    setValues={setFindDepartments}
                    placeholder="Department"
                    allowCustom
                  />
                </div>
              </div>
              <div className="flex gap-2 px-4 py-3 border-t">
                <Button variant="outline" className="w-1/3" onClick={handleFindClear}>
                  Clear {findActiveCount ? `(${findActiveCount})` : ""}
                </Button>
                <Button className="w-2/3" onClick={handleFindApply}>
                  Apply Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={() => openAddModal()} className="h-9 bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add to List
          </Button>
        </div>
        <div className="flex-1 overflow-hidden px-6 pt-2 pb-6">
          <ScrollArea className="rounded-lg border bg-white shadow-sm max-h-[450px]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[48px] px-4 py-3">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => handleSelectAllRows(Boolean(checked))}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead className="min-w-[180px] py-3">Lead</TableHead>
                  <TableHead className="min-w-[110px] py-3">Status</TableHead>
                  <TableHead className="min-w-[150px] py-3">Title</TableHead>
                  <TableHead className="min-w-[170px] py-3">Company</TableHead>
                  <TableHead className="min-w-[200px] py-3">Email</TableHead>
                  <TableHead className="min-w-[160px] py-3">Phone</TableHead>
                  <TableHead className="min-w-[80px] py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingLeads ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : visibleLeads.length > 0 ? (
                  visibleLeads.map((lead) => (
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
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shadow ring-2 ring-primary/10">
                            <AvatarImage src={lead.avatar} alt={lead.name} />
                            <AvatarFallback>
                              {lead.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 font-medium text-sm text-foreground">
                              {lead.name}
                              {lead.linkedin_url && (
                                <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" title="View LinkedIn Profile">
                                  <Linkedin className="h-3.5 w-3.5 text-primary hover:text-primary/80" />
                                </a>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{lead.industry || lead.company}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">{statusPill(lead.status)}</TableCell>
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
                      <TableCell className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast({title: "View Details", description: "Coming soon!"})}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setEditingLead(lead); setIsAddLeadOpen(true); }}>
                              <Edit3 className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setLeads(prev => {
                                const updated = prev.filter(l => l.id !== lead.id);
                                localStorage.setItem(LOCAL_STORAGE_KEY_LEADS, JSON.stringify(updated));
                                return updated;
                              });
                              toast({ title: "Lead Deleted", description: `${lead.name} has been removed.` });
                            }}>
                              <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No leads found. Click "Add to List" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          {/* View All/Collapse toggle */}
          <div className="flex items-center justify-center mt-3">
            {filteredLeads.length > LEADS_TO_SHOW && (
              <Button variant="ghost" size="sm" onClick={() => setViewAll(v => !v)}>
                {viewAll ? "Show Less" : "View All"}
              </Button>
            )}
          </div>
        </div>
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