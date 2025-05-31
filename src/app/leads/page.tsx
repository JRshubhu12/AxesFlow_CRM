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
  X,
  Bookmark,
  ChevronDown,
  User,
  Briefcase,
  MapPin,
  Building2,
  Users as UsersIcon,
  DollarSign,
  Settings,
  GraduationCap,
  AtSign,
  Link2,
  Layers,
} from 'lucide-react';
import React, { useState } from "react";
import sampleLeads from './sample.json';
import { useRouter, usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

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
  // ... your leads here ...
];

export default function LeadsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Tab navigation for subpages
  const tabs = [
    { label: 'Find Leads', path: '/leads' },
    { label: 'Manage Leads', path: '/leads/manage' },
  ];

  // Dynamically get columns from the first lead in sample.json
  const leads: any[] = sampleLeads;
  const columns = leads.length > 0 ? Object.keys(leads[0]) : [];

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<string>(columns[0] || "");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isFindPopoverOpen, setIsFindPopoverOpen] = useState(false);

  // Search filter state
  const [filters, setFilters] = useState<{
    name: string;
    title: string[];
    location: string[];
    industry: string;
    employeeSize: string[];
    revenue: string[];
    linkedinOrTwitter: string;
  }>({
    name: "",
    title: [],
    location: [],
    industry: "",
    employeeSize: [],
    revenue: [],
    linkedinOrTwitter: "",
  });

  // Helper functions for chips
  const addFilterChip = (type: keyof typeof filters, value: string) => {
    if (Array.isArray(filters[type])) {
      setFilters(f => ({
        ...f,
        [type]: (f[type] as string[]).includes(value) ? f[type] : [...(f[type] as string[]), value],
      }));
    }
  };
  const removeFilterChip = (type: keyof typeof filters, value: string) => {
    if (Array.isArray(filters[type])) {
      setFilters(f => ({
        ...f,
        [type]: (f[type] as string[]).filter(v => v !== value),
      }));
    }
  };

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir(dir => dir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  // Main filtering logic
  const filteredLeads = leads.filter((lead: any) => {
    // Name filter
    if (filters.name && !lead.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
    // Title filter
    if (filters.title.length > 0 && !filters.title.some(t => lead.title?.toLowerCase().includes(t.toLowerCase()))) return false;
    // Location filter
    if (filters.location.length > 0 && !filters.location.some(l => lead.location?.toLowerCase().includes(l.toLowerCase()))) return false;
    // Industry filter
    if (filters.industry && !lead.industry?.toLowerCase().includes(filters.industry.toLowerCase())) return false;
    // Employee size (assume you have a field for this, else skip or adjust)
    // Revenue (assume you have a field for this, else skip or adjust)
    // LinkedIn/Twitter filter (search linkedin_url or twitter_url fields)
    if (filters.linkedinOrTwitter && !((lead.linkedin_url || "").toLowerCase().includes(filters.linkedinOrTwitter.toLowerCase()) || (lead.twitter_url || "").toLowerCase().includes(filters.linkedinOrTwitter.toLowerCase()))) return false;
    return true;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let valA = (a[sortField] || "") as string;
    let valB = (b[sortField] || "") as string;
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const isAllSelected = leads.length > 0 && leads.every((lead, idx) => selectedRows[idx]);

  // Remove the profilePic (or similar) and status column from the columns array before rendering the table
  const filteredColumns = columns.filter(col => col.toLowerCase() !== 'profilepic' && col.toLowerCase() !== 'profile picture' && col.toLowerCase() !== 'avatar' && col.toLowerCase() !== 'status');

  // Input handlers for filters
  const handleInputChange = (type: keyof typeof filters, value: string) => {
    setFilters(f => ({
      ...f,
      [type]: value,
    }));
  };

  // For chips: in real app, use autocomplete/select. Here, fake chips for demo.
  // Example options
  const titleOptions = ["Founder", "CEO", "CTO", "Manager"];
  const locationOptions = ["USA", "India", "UK", "New York, NY", "San Francisco, CA"];
  const employeeSizeOptions = ["0-25", "25-100", "100-500"];
  const revenueOptions = ["$1M - $10M", "$10M - $50M"];

  function handleClearFilters() {
    setFilters({
      name: "",
      title: [],
      location: [],
      industry: "",
      employeeSize: [],
      revenue: [],
      linkedinOrTwitter: "",
    });
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        {/* Subpage Tabs */}
        <div className="flex items-center gap-2 px-10 pt-8 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`px-4 py-2 rounded-lg font-medium text-base transition-colors duration-150 ${pathname === tab.path ? 'bg-[#7F57F1] text-white' : 'bg-[#F4F4F7] text-[#222]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Top search & heading */}
        <div className="flex items-center justify-between px-10 pt-8 pb-2">
          <div className="flex-1 flex items-center">
            <h2 className="font-semibold text-2xl mr-6">Find Leads</h2>
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
          <div className="flex-1" />
          {/* Find Leads Popover */}
          <Popover open={isFindPopoverOpen} onOpenChange={setIsFindPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="default" className="h-9 px-6 font-semibold flex items-center gap-2 bg-[#7F57F1] text-white">
                Find Leads
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 shadow-xl rounded-lg border overflow-auto max-h-[90vh]">
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
                <h3 className="text-base font-semibold">Find Leads</h3>
                <div className="flex items-center gap-2">
                  <Bookmark className="text-[#7F57F1] h-5 w-5" />
                  <PopoverClose asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                      <X className="h-5 w-5" />
                    </Button>
                  </PopoverClose>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Name */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <User className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    placeholder="Name"
                    className="border-0 bg-transparent p-0 h-7 focus:ring-0"
                    value={filters.name}
                    onChange={e => handleInputChange("name", e.target.value)}
                  />
                </div>
                {/* Title */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {filters.title.map(t => (
                      <span key={t} className="bg-[#E5E7EB] text-[#222] rounded-full px-2 py-0.5 text-xs flex items-center">
                        {t}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("title", t)} />
                      </span>
                    ))}
                    {/* Demo: Add buttons for titles */}
                    {titleOptions.filter(opt => !filters.title.includes(opt)).map(opt => (
                      <button key={opt} className="bg-[#F5F5F7] rounded-full px-2 py-0.5 text-xs border ml-1" type="button" onClick={() => addFilterChip("title", opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                {/* Location */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {filters.location.map(loc => (
                      <span key={loc} className="bg-[#E5E7EB] text-[#222] rounded-full px-2 py-0.5 text-xs flex items-center">
                        {loc}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("location", loc)} />
                      </span>
                    ))}
                    {/* Demo: Add buttons for locations */}
                    {locationOptions.filter(opt => !filters.location.includes(opt)).map(opt => (
                      <button key={opt} className="bg-[#F5F5F7] rounded-full px-2 py-0.5 text-xs border ml-1" type="button" onClick={() => addFilterChip("location", opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                {/* Industry */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <Building2 className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    placeholder="Industry"
                    className="border-0 bg-transparent p-0 h-7 focus:ring-0"
                    value={filters.industry}
                    onChange={e => handleInputChange("industry", e.target.value)}
                  />
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                {/* Employee Size */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <UsersIcon className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {filters.employeeSize.map(s => (
                      <span key={s} className="bg-[#E5E7EB] text-[#222] rounded-full px-2 py-0.5 text-xs flex items-center">
                        {s}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("employeeSize", s)} />
                      </span>
                    ))}
                    {employeeSizeOptions.filter(opt => !filters.employeeSize.includes(opt)).map(opt => (
                      <button key={opt} className="bg-[#F5F5F7] rounded-full px-2 py-0.5 text-xs border ml-1" type="button" onClick={() => addFilterChip("employeeSize", opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                {/* Revenue */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="flex flex-wrap gap-1 flex-1">
                    {filters.revenue.map(r => (
                      <span key={r} className="bg-[#E5E7EB] text-[#222] rounded-full px-2 py-0.5 text-xs flex items-center">
                        {r}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("revenue", r)} />
                      </span>
                    ))}
                    {revenueOptions.filter(opt => !filters.revenue.includes(opt)).map(opt => (
                      <button key={opt} className="bg-[#F5F5F7] rounded-full px-2 py-0.5 text-xs border ml-1" type="button" onClick={() => addFilterChip("revenue", opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
                {/* LinkedIn URL or Twitter */}
                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#FAFAFB]">
                  <Link2 className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    placeholder="LinkedIn URL or Twitter"
                    className="border-0 bg-transparent p-0 h-7 focus:ring-0"
                    value={filters.linkedinOrTwitter}
                    onChange={e => handleInputChange("linkedinOrTwitter", e.target.value)}
                  />
                </div>
                {/* Other filters, skills, department etc, can be added similarly */}
              </div>
              <div className="flex gap-2 px-4 py-3 border-t mt-2">
                <Button variant="outline" className="w-1/2 border-destructive text-destructive hover:bg-destructive/10" onClick={handleClearFilters}>
                  Clear ({Object.values(filters).some(f => Array.isArray(f) ? f.length : f) ? Object.values(filters).filter(f => Array.isArray(f) ? f.length : f).length : 0})
                </Button>
                <Button className="w-1/2 bg-[#7F57F1] text-white font-semibold" onClick={() => setIsFindPopoverOpen(false)}>
                  Find Leads
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto px-10 pb-8">
          <div className="rounded-xl border border-[#E1E1F0] bg-white">
            <Table className="min-w-full border-separate border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-[#E1E1F0]">
                  {filteredColumns.map(col => (
                    <TableHead
                      key={col}
                      className="py-2 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB] group select-none"
                      onClick={() => handleSort(col)}
                    >
                      <div className="flex items-center gap-1">
                        {col}
                        <ArrowUpDown className="h-4 w-4 text-[#B8B8C0] opacity-80 group-hover:text-[#7F57F1]" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={filteredColumns.length} className="py-8 text-center text-muted-foreground">
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLeads.map((lead, idx) => (
                    <TableRow key={idx} className="border-b border-[#E1E1F0] hover:bg-[#F7F7FA]">
                      {filteredColumns.map(col => (
                        <TableCell key={col} className={`py-1 px-2 border-r border-[#E1E1F0] align-top${col === 'Problem' ? ' max-w-[220px]' : ''}`}> 
                          {col.toLowerCase().includes('name') ? (
                            <div className="flex items-center">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {(lead.avatar || lead["profilePic"] || lead["Profile Picture"]) && (
                                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden border border-[#E1E1F0] bg-gray-100">
                                    <img
                                      src={lead.avatar || lead["profilePic"] || lead["Profile Picture"]}
                                      alt={lead.name || lead["Name"]}
                                      className="h-8 w-8 object-cover"
                                    />
                                  </span>
                                )}
                                <span className="font-medium text-sm text-[#222] whitespace-nowrap text-ellipsis overflow-hidden block">
                                  {lead.name || lead["Name"]}
                                </span>
                              </div>
                              {/* LinkedIn icon in its own flex column for perfect vertical alignment */}
                              <div className="flex items-center justify-center min-w-[32px] pl-2">
                                <LinkedInIcon />
                              </div>
                            </div>
                          ) : col === 'Problem' ? (
                            <div className="max-h-16 overflow-y-auto text-xs pr-1" style={{whiteSpace: 'pre-line'}}>
                              {lead[col] !== null && lead[col] !== undefined && lead[col] !== '' ? lead[col] : '-'}
                            </div>
                          ) : lead[col] && typeof lead[col] === 'string' && lead[col].startsWith('http') ? (
                            <a href={lead[col]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                              {lead[col]}
                            </a>
                          ) : (
                            <span className="text-xs">{lead[col] !== null && lead[col] !== undefined && lead[col] !== '' ? lead[col] : '-'}</span>
                          )}
                        </TableCell>
                      ))}
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