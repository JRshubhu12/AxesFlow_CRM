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
  ChevronDown,
  User,
  Briefcase,
  Building2,
  Users as UsersIcon,
  DollarSign,
  GraduationCap,
  Link2,
  Loader2,
  Filter,
  ListFilter,
  ChevronLeft,
  RefreshCw,
  MoreVertical,
  Edit2,
  Mail,
  Trash2
} from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from "react";
import sampleLeads from './sample.json';
import { useRouter, usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// LinkedIn SVG icon component for consistency and icon emphasis
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="hover:opacity-80 transition-opacity">
    <rect width="20" height="20" rx="4" fill="#0A66C2" />
    <path d="M6.223 16V8.307H3.574V16h2.649zM4.899 7.18c.92 0 1.49-.611 1.49-1.374-.017-.78-.57-1.374-1.473-1.374-.903 0-1.49.594-1.49 1.374 0 .763.57 1.374 1.455 1.374h.018zm2.821 8.82h2.65v-4.355c0-.233.017-.466.086-.633.19-.467.624-.951 1.352-.951.954 0 1.336.718 1.336 1.771V16h2.65v-4.542c0-2.436-1.299-3.572-3.033-3.572-1.397 0-2.017.777-2.366 1.324h.018v-1.14H7.72c.035.74 0 7.43 0 7.43z" fill="#fff" />
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
  problem?: string;
}

interface SearchCriteria {
  companyName: string;
  companyNationality: string[];
  roles: string[];
  industries: string[];
  employeeStrength: string[];
  investmentRange: string;
  platforms: string[];
}

const statusColors = {
  "New": "bg-blue-100 text-blue-800",
  "Contacted": "bg-purple-100 text-purple-800",
  "Qualified": "bg-green-100 text-green-800",
  "Proposal Sent": "bg-yellow-100 text-yellow-800",
  "Closed - Won": "bg-emerald-100 text-emerald-800",
  "Closed - Lost": "bg-red-100 text-red-800"
};

export default function LeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const findLeadsBtnRef = useRef<HTMLButtonElement>(null);

  // State management
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<keyof Lead>('name');
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isFindPopoverOpen, setIsFindPopoverOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    companyName: "",
    companyNationality: [],
    roles: [],
    industries: [],
    employeeStrength: [],
    investmentRange: "",
    platforms: [],
  });
  const [generalSearch, setGeneralSearch] = useState(""); // New general free-text search input

  // New states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Tab navigation
  const tabs = [
    { label: 'Find Leads', path: '/leads' },
    { label: 'Manage Leads', path: '/leads/manage' },
  ];

  // ...existing code...

  // Sample data and columns
  const leads: Lead[] = sampleLeads;

  // Full-lead filtering logic with search criteria and general search
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Company Name filter
      if (searchCriteria.companyName && !lead.company.toLowerCase().includes(searchCriteria.companyName.toLowerCase())) {
        return false;
      }
      // Company Nationality filter
      if (searchCriteria.companyNationality.length > 0) {
        if (!searchCriteria.companyNationality.includes(lead.location || "")) {
          return false;
        }
      }
      // Roles filter on title
      if (searchCriteria.roles.length > 0) {
        const titleLower = (lead.title || "").toLowerCase();
        if (!searchCriteria.roles.some(role => titleLower.includes(role.toLowerCase()))) {
          return false;
        }
      }
      // Industries filter
      if (searchCriteria.industries.length > 0) {
        if (!searchCriteria.industries.includes(lead.industry || "")) {
          return false;
        }
      }
      // Employee Strength - Simple check if company size falls in employeeStrength ranges, assume we do not have exact mapping, so skip for now

      // Investment Range - no direct mapping in sample data, so skip for now

      // Platforms filter on social presence, check linkedin and platforms filter
      if (searchCriteria.platforms.length > 0) {
        const hasLinkedIn = !!lead.linkedin_url;
        let platformMatched = false;
        if (searchCriteria.platforms.includes("LinkedIn") && hasLinkedIn) {
          platformMatched = true;
        }
        // For other platforms no data, skip
        if (!platformMatched) return false;
      }

      // General search filter across name, email, company, title, problem
      if (generalSearch.trim() !== "") {
        const searchLower = generalSearch.toLowerCase();
        const combinedText = [
          lead.name,
          lead.email,
          lead.company,
          lead.title,
          lead.problem
        ].filter(Boolean).join(" ").toLowerCase();
        if (!combinedText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [leads, searchCriteria, generalSearch]);

  // Sorting logic
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      if (!a[sortField]) return 1;
      if (!b[sortField]) return -1;
      const valA = (a[sortField] || "").toString().toLowerCase();
      const valB = (b[sortField] || "").toString().toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortField, sortDir]);

  // Pagination controls for displayed leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedLeads]);

  // Column names excluding avatar, profile picture, and id
  const columns = leads.length > 0 ? Object.keys(leads[0]).filter(key => !['avatar', 'profilepic', 'profile picture', 'id'].includes(key.toLowerCase())) : [];

  // Column display names for prettified titles
  const columnDisplayNames: Record<string, string> = {
    name: "Name",
    company: "Company",
    email: "Email",
    status: "Status",
    lastContact: "Last Contact",
    website: "Website",
    title: "Title",
    phone: "Phone",
    location: "Location",
    industry: "Industry",
    linkedin_url: "LinkedIn",
    problem: "Problem"
  };

  // Enhanced helper functions for filters
  const addFilterChip = (type: keyof SearchCriteria, value: string) => {
    if (Array.isArray(searchCriteria[type]) && !searchCriteria[type].includes(value)) {
      setSearchCriteria(prev => ({
        ...prev,
        [type]: [...(prev[type] as string[]), value],
      }));
    }
  };

  const removeFilterChip = (type: keyof SearchCriteria, value: string) => {
    if (Array.isArray(searchCriteria[type])) {
      setSearchCriteria(prev => ({
        ...prev,
        [type]: (prev[type] as string[]).filter(v => v !== value),
      }));
    }
  };

  const handleInputChange = (field: keyof SearchCriteria, value: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDir(dir => dir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // Handle row selection toggle
  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const copy = {...prev};
      if (copy[id]) {
        delete copy[id];
      } else {
        copy[id] = true;
      }
      return copy;
    });
  };

  // Select or deselect all on current page
  const toggleSelectAll = () => {
    const allSelected = paginatedLeads.every(lead => selectedRows[lead.id]);
    if (allSelected) {
      // Unselect all current page
      setSelectedRows(prev => {
        const newObj = {...prev};
        paginatedLeads.forEach(lead => {
          delete newObj[lead.id];
        });
        return newObj;
      });
    } else {
      // Select all current page
      setSelectedRows(prev => {
        const newObj = {...prev};
        paginatedLeads.forEach(lead => {
          newObj[lead.id] = true;
        });
        return newObj;
      });
    }
  };

  // Bulk actions placeholders
  const deleteSelected = () => {
    if (Object.keys(selectedRows).length === 0) {
      alert("No leads selected to delete.");
      return;
    }
    if (confirm(`Are you sure you want to delete ${Object.keys(selectedRows).length} selected leads? This action cannot be undone.`)) {
      alert("Delete action executed.");
      setSelectedRows({});
    }
  };

  const exportSelectedCSV = () => {
    if (Object.keys(selectedRows).length === 0) {
      alert("No leads selected to export.");
      return;
    }
    // Generate a CSV string of selected leads
    const selectedLeads = leads.filter(l => selectedRows[l.id]);
    const header = Object.keys(leads[0]).join(",");
    const rows = selectedLeads.map(lead => 
      Object.values(leads[0]).map((_, idx) => {
        const key = Object.keys(leads[0])[idx];
        let val = lead[key as keyof Lead];
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""'); // Escape quotes
          if (val.includes(",") || val.includes("\n")) {
            val = `"${val}"`;
          }
        }
        return val ?? "";
      }).join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `selected-leads-${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Search button triggers search state and progress bar simulation
  const handleSearch = () => {
    setIsSearching(true);
    setProgress(0);
  };

  // Progress bar effects and redirect simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      let prog = 0;
      setProgress(0);
      interval = setInterval(() => {
        prog += Math.floor(Math.random() * 15) + 7;
        if (prog >= 100) {
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            router.push("/leads/found-leads");
          }, 500);
        } else {
          setProgress(prog);
        }
      }, 200);
    }
    return () => { if(interval) clearInterval(interval); };
  }, [isSearching, router]);

  const handleResetSearch = () => {
    setSearchCriteria({
      companyName: "",
      companyNationality: [],
      roles: [],
      industries: [],
      employeeStrength: [],
      investmentRange: "",
      platforms: [],
    });
    setGeneralSearch('');
    setIsSearching(false);
  };

  // Pagination controls
  const totalPages = Math.max(Math.ceil(sortedLeads.length / itemsPerPage), 1);



  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-muted/40">
        {/* Header with tabs and actions */}
        <div className="flex justify-between items-center px-8 pt-6 pb-4 border-b border-gray-300">
          <div className="flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className={cn(
                  "px-5 py-2 rounded-lg font-semibold text-lg shadow transition-colors duration-150",
                  pathname === tab.path
                    ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg"
                    : "bg-transparent text-gray-700 hover:bg-indigo-100"
                )}
                aria-current={pathname === tab.path ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button
            variant="default"
            size="lg"
            className="gap-2"
            onClick={() => router.push('/leads/manage')}
            aria-label="Go to Manage Leads"
          >
            <UsersIcon className="h-5 w-5" />
            Manage Leads
          </Button>
        </div>

        {/* Search and filters card */}
        {!isSearching && (
          <Card className="max-w-6xl mx-auto my-8 p-6 shadow-xl rounded-xl border border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3 font-bold text-indigo-800">
                <Search className="h-6 w-6 text-indigo-600" />
                Find Leads
              </CardTitle>
              <CardDescription className="text-indigo-700 max-w-xl">
                Use multiple filters and search options to find your ideal leads efficiently
              </CardDescription>
            </CardHeader>

            {/* General Search and Company Name */}
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-indigo-700">
                    General Search
                    <span className="text-xs ml-1 font-normal text-gray-500">(name, email, company, title, problem)</span>
                  </label>
                  <Input
                    placeholder="Enter keywords to search anywhere..."
                    value={generalSearch}
                    onChange={e => setGeneralSearch(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="max-w-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-indigo-700">Company Name</label>
                  <Input
                    placeholder="Filter by company"
                    value={searchCriteria.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="max-w-lg"
                  />
                </div>
              </div>

              {/* Filter chips and options grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
                {/* Company Nationality */}
                <FilterSection
                  label="Company Nationality"
                  selectedItems={searchCriteria.companyNationality}
                  options={["USA", "UK", "India", "Canada", "Germany", "France", "Australia"]}
                  onAdd={val => addFilterChip("companyNationality", val)}
                  onRemove={val => removeFilterChip("companyNationality", val)}
                />
                {/* Roles */}
                <FilterSection
                  label="Roles"
                  selectedItems={searchCriteria.roles}
                  options={["CEO", "CFO", "CTO", "CMO", "Director", "Manager", "Founder"]}
                  onAdd={val => addFilterChip("roles", val)}
                  onRemove={val => removeFilterChip("roles", val)}
                />
                {/* Industries */}
                <FilterSection
                  label="Industries"
                  selectedItems={searchCriteria.industries}
                  options={["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing"]}
                  onAdd={val => addFilterChip("industries", val)}
                  onRemove={val => removeFilterChip("industries", val)}
                />
                {/* Employee Strength */}
                <FilterSection
                  label="Employee Strength"
                  selectedItems={searchCriteria.employeeStrength}
                  options={["10-25", "25-50", "50-100", "100-250", "250-500", "500+"]}
                  onAdd={val => addFilterChip("employeeStrength", val)}
                  onRemove={val => removeFilterChip("employeeStrength", val)}
                />
                {/* Investment Range */}
                <FilterSelect
                  label="Investment Range"
                  value={searchCriteria.investmentRange}
                  options={["", "$0-$1M", "$1M-$5M", "$5M-$10M", "$10M-$50M", "$50M+"]}
                  onChange={(val) => handleInputChange("investmentRange", val)}
                />
                {/* Platforms */}
                <FilterSection
                  label="Platforms"
                  selectedItems={searchCriteria.platforms}
                  options={["LinkedIn", "Twitter", "Instagram", "Facebook", "Other"]}
                  onAdd={val => addFilterChip("platforms", val)}
                  onRemove={val => removeFilterChip("platforms", val)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleResetSearch} className="text-indigo-700 border-indigo-400 hover:bg-indigo-100">
                Reset
              </Button>
              <Button onClick={handleSearch} className="gap-2" aria-label="Search leads">
                <Search className="h-4 w-4" /> Search Leads
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Searching State and Progress */}
        {isSearching && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <Card className="max-w-md w-full text-center shadow-lg rounded-xl border border-indigo-300 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-indigo-700 font-semibold text-xl">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  Searching Leads
                </CardTitle>
                <CardDescription>
                  {progress < 50
                    ? "Gathering potential leads..."
                    : progress < 80
                      ? "Filtering based on your criteria..."
                      : "Finalizing results..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3 rounded-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Previous Leads Table, grouped by day */}
        {!isSearching && filteredLeads.length > 0 && (
          <Card className="max-w-7xl mx-auto p-6 my-6 rounded-xl shadow-lg border border-indigo-300 bg-white overflow-x-auto">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Previous Leads</h2>
            {/* Group leads by lastContact date (day) */}
            {Object.entries(
              filteredLeads.reduce((acc: Record<string, Lead[]>, lead) => {
                const dateKey = lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : "Unknown";
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(lead);
                return acc;
              }, {})
            ).sort((a, b) => {
              // Sort by date descending (most recent first)
              if (a[0] === "Unknown") return 1;
              if (b[0] === "Unknown") return -1;
              return new Date(b[0]).getTime() - new Date(a[0]).getTime();
            }).map(([date, leadsForDay]) => (
              <div key={date} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-indigo-700">{date}</span>
                  <span className="text-xs text-gray-500">({leadsForDay.length} lead{leadsForDay.length !== 1 ? 's' : ''})</span>
                </div>
                <Table className="min-w-full border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="border-b border-indigo-300 bg-indigo-50">
                      {columns.map(col => (
                        <TableHead
                          key={col}
                          onClick={() => handleSort(col as keyof Lead)}
                          className="cursor-pointer select-none whitespace-nowrap py-3 px-4 font-semibold text-indigo-900 border-r border-indigo-300"
                          title={`Sort by ${columnDisplayNames[col] || col}`}
                        >
                          <div className="flex items-center gap-1">
                            {columnDisplayNames[col] || col}
                            {sortField === col && <ArrowUpDown className={cn("h-4 w-4", sortDir === "desc" ? "rotate-180" : "")}/>} 
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="py-3 px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadsForDay.map(lead => (
                      <TableRow key={lead.id} className="odd:bg-white even:bg-indigo-50 hover:bg-indigo-100">
                        {columns.map(col => {
                          let content: React.ReactNode = lead[col as keyof Lead];
                          if (col === "status") {
                            content = (
                              <Badge className={cn("select-none", statusColors[lead.status] || "bg-gray-200 text-gray-700")}>{lead.status}</Badge>
                            );
                          }
                          if (col === "avatar") {
                            content = lead.avatar ? <Avatar className="h-10 w-10"><AvatarImage src={lead.avatar} alt={lead.name} /><AvatarFallback>{lead.name.charAt(0)}</AvatarFallback></Avatar> : null;
                          }
                          if (col === "linkedin_url") {
                            content = lead.linkedin_url ? (
                              <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profile for ${lead.name}`}>
                                <LinkedInIcon />
                              </a>
                            ) : <span className="text-gray-400 select-none">-</span>;
                          }
                          if (col === "lastContact") {
                            content = lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : "-";
                          }
                          if (col === "website") {
                            content = <LinkBadge url={lead.website} label={lead.website ? new URL(lead.website).host.replace("www.","") : "-"} />;
                          }
                          return (
                            <TableCell key={col} className="px-4 py-2 border-r border-indigo-300 align-middle whitespace-nowrap max-w-xs truncate">
                              {content}
                            </TableCell>
                          );
                        })}
                        <TableCell className="flex items-center space-x-2 px-4 py-2 justify-center border-indigo-300">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Actions for ${lead.name}`}>
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-1 w-44">
                              <button
                                onClick={() => alert(`Viewing details of ${lead.name}`)}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-100 rounded text-indigo-800 font-semibold"
                                type="button"
                              >
                                <User className="w-4 h-4" /> View Details
                              </button>
                              <button
                                onClick={() => alert(`Edit functionality for ${lead.name} coming soon`)}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-100 rounded text-indigo-800 font-semibold"
                                type="button"
                              >
                                <Edit2 className="w-4 h-4" /> Edit Lead
                              </button>
                              <button
                                onClick={() => window.location.href = `mailto:${lead.email}`}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-100 rounded text-indigo-800 font-semibold"
                                type="button"
                              >
                                <Mail className="w-4 h-4" /> Send Email
                              </button>
                              {lead.linkedin_url && (
                                <a
                                  href={lead.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-100 rounded text-indigo-800 font-semibold"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <Link2 className="w-4 h-4" /> LinkedIn
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${lead.name}?`)) {
                                    alert(`Deleting lead: ${lead.name}`);
                                  }
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 rounded text-red-600 font-semibold"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" /> Delete Lead
                              </button>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </Card>
        )}

        {/* No leads found message */}
        {!isSearching && filteredLeads.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center max-w-lg mx-auto text-gray-700 space-y-4">
            <UsersIcon className="w-16 h-16 text-indigo-400 mx-auto" />
            <h3 className="text-xl font-semibold">No leads match your criteria</h3>
            <p className="text-sm">Try adjusting your filters or search terms to find leads.</p>
            <Button variant="outline" onClick={handleResetSearch} className="mt-4">Reset Filters</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Component for filter chip list with selectable badges
function FilterSection({
  label,
  selectedItems,
  options,
  onAdd,
  onRemove,
}: {
  label: string;
  selectedItems: string[];
  options: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div>
      <label className="block font-semibold text-indigo-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 min-h-[36px] mb-2">
        {selectedItems.length === 0 && <p className="text-sm text-gray-400">No filter selected</p>}
        {selectedItems.map(item => (
          <Badge
            key={item}
            variant="secondary"
            className="pl-3 pr-1 py-1 cursor-default flex items-center"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="ml-1 rounded-full hover:bg-accent p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label={`Remove ${item} from ${label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.filter(opt => !selectedItems.includes(opt)).map(opt => (
          <Badge
            key={opt}
            variant="outline"
            className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800 dark:text-indigo-300"
            onClick={() => onAdd(opt)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAdd(opt);
              }
            }}
            aria-label={`Add ${opt} to ${label}`}
          >
            {opt}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Component for filter select dropdown
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={`select-${label}`} className="block font-semibold text-indigo-700 mb-2">{label}</label>
      <select
        id={`select-${label}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border border-indigo-300 rounded-md p-2 w-full text-indigo-900"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt === "" ? `Select ${label}` : opt}</option>
        ))}
      </select>
    </div>
  );
}

// Icon from lucide-react renamed because UsersIcon conflicts with variable
// (Removed duplicate import, already imported at the top)

// LinkBadge reused inside this file for website/link display with icon and truncated host
const LinkBadge = ({ url, label }: { url?: string; label: string }) => {
  if (!url) return <>{label}</>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-indigo-600 hover:underline">
      <Link2 className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
};