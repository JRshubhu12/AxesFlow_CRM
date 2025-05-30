"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Plus,
  Download,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { useState, useEffect } from "react";

// LinkedIn SVG icon as in the image (blue background, white "in")
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#0A66C2"/>
    <path d="M6.223 16V8.307H3.574V16h2.649zM4.899 7.18c.92 0 1.49-.611 1.49-1.374-.017-.78-.57-1.374-1.473-1.374-.903 0-1.49.594-1.49 1.374 0 .763.57 1.374 1.455 1.374h.018zm2.821 8.82h2.65v-4.355c0-.233.017-.466.086-.633.19-.467.624-.951 1.352-.951.954 0 1.336.718 1.336 1.771V16h2.65v-4.542c0-2.436-1.299-3.572-3.033-3.572-1.397 0-2.017.777-2.366 1.324h.018v-1.14H7.72c.035.74 0 7.43 0 7.43z" fill="#fff"/>
  </svg>
);

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
  linkedin_url?: string;
}

// Example initial data (use your full previous array for real usage)
const initialLeadsData: Lead[] = [
  {
    id: "1",
    name: "Ronald Richards",
    company: "Aster Medical",
    email: "ronaldrichards@gmail.com",
    status: "New",
    lastContact: "2024-05-30T09:00:00.000Z",
    website: "https://astermedical.com",
    title: "Founder & CEO",
    phone: "(219) 555-0114",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "New York, NY",
    industry: "Healthcare",
    linkedin_url: "https://linkedin.com/in/ronaldrichards"
  },
  {
    id: "2",
    name: "Courtney Henry",
    company: "Big Kahuna Burger Ltd.",
    email: "courtneyhenry@gmail.com",
    status: "Contacted",
    lastContact: "2024-05-29T09:00:00.000Z",
    website: "",
    title: "CEO",
    phone: "(907) 555-0101",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    location: "San Francisco, CA",
    industry: "Food & Beverage",
    linkedin_url: "https://linkedin.com/in/courtneyhenry"
  },
  // ... add the rest of your leads here ...
];

const LOCAL_STORAGE_KEY_LEADS = 'axesflowLeads';

const columns = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Numbers" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

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

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir(dir => dir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sortedLeads = [...leads].sort((a, b) => {
    let valA = (a[sortField as keyof Lead] || "") as string;
    let valB = (b[sortField as keyof Lead] || "") as string;
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const isAllSelected = leads.length > 0 && leads.every(lead => selectedRows[lead.id]);

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        {/* Top search & heading */}
        <div className="flex items-center justify-between px-10 pt-8 pb-2">
          <div className="flex-1 flex items-center">
            <h2 className="font-semibold text-2xl mr-6">Find Leads</h2>
            <div className="flex items-center flex-1">
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="search for features, settings and more"
                      className="w-full h-10 px-10 rounded-full border border-[#E1E1F0] bg-white placeholder:text-gray-400 text-base focus:outline-none"
                      style={{ boxShadow: "0 1px 0 0 #ececec" }}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Top actions */}
        <div className="flex items-center gap-3 px-10 pt-3 pb-2">
          <Button variant="outline" className="h-9 px-4 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button variant="outline" className="h-9 px-4 font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add to List
          </Button>
          <Button variant="outline" className="h-9 px-4 font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add to Campaign
          </Button>
          <Button variant="outline" className="h-9 px-4 font-medium flex items-center gap-2">
            <Search className="h-4 w-4" /> Find more
          </Button>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto px-10 pb-8">
          <div className="rounded-xl border border-[#E1E1F0] bg-white">
            <Table className="min-w-full border-separate border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-[#E1E1F0]">
                  <TableHead className="w-[48px] py-3 px-4 border-r border-[#E1E1F0] bg-[#FAFAFB]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={checked => {
                        const all: Record<string, boolean> = {};
                        if (checked) leads.forEach(l => { all[l.id] = true });
                        setSelectedRows(all);
                      }}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  {columns.map(col => (
                    <TableHead
                      key={col.key}
                      className="py-3 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB] group cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className="h-4 w-4 text-[#B8B8C0] opacity-80 group-hover:text-[#7F57F1]" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingLeads ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="py-8 text-center text-muted-foreground">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : sortedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="py-8 text-center text-muted-foreground">
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-b border-[#E1E1F0] hover:bg-[#F7F7FA]">
                      <TableCell className="py-3 px-4 border-r border-[#E1E1F0] align-middle">
                        <Checkbox
                          checked={selectedRows[lead.id] || false}
                          onCheckedChange={checked =>
                            setSelectedRows(prev => ({ ...prev, [lead.id]: Boolean(checked) }))
                          }
                          aria-label={`Select row for ${lead.name}`}
                        />
                      </TableCell>
                      {/* Name + LinkedIn */}
                      <TableCell className="py-2 px-3 border-r border-[#E1E1F0] align-middle">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border shadow-sm">
                            <AvatarImage src={lead.avatar} alt={lead.name} />
                            <AvatarFallback>
                              {lead.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm text-[#222]">{lead.name}</span>
                          {lead.linkedin_url && (
                            <a
                              href={lead.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1"
                              title="LinkedIn"
                            >
                              <LinkedInIcon />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      {/* Title */}
                      <TableCell className="py-2 px-3 border-r border-[#E1E1F0] align-middle">
                        <span className="text-sm text-[#222]">{lead.title || '-'}</span>
                      </TableCell>
                      {/* Company */}
                      <TableCell className="py-2 px-3 border-r border-[#E1E1F0] align-middle">
                        <span className="text-sm text-[#222]">{lead.company}</span>
                      </TableCell>
                      {/* Email */}
                      <TableCell className="py-2 px-3 border-r border-[#E1E1F0] align-middle">
                        <span className="text-sm text-[#222]">{lead.email}</span>
                      </TableCell>
                      {/* Phone */}
                      <TableCell className="py-2 px-3 align-middle">
                        <span className="text-sm text-[#222]">{lead.phone || '-'}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}