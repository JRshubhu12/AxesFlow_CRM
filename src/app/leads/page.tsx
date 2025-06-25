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
  ChevronLeft
} from 'lucide-react';
import React, { useState, useRef, useEffect } from "react";
import sampleLeads from './sample.json';
import { useRouter, usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// LinkedIn SVG icon component
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="hover:opacity-80 transition-opacity">
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
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isFindPopoverOpen, setIsFindPopoverOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Tab navigation
  const tabs = [
    { label: 'Find Leads', path: '/leads' },
    { label: 'Manage Leads', path: '/leads/manage' },
  ];

  // Sample data and columns
  const leads: Lead[] = sampleLeads;
  const columns = leads.length > 0 ? Object.keys(leads[0]) : [];

  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    companyName: "",
    companyNationality: [],
    roles: [],
    industries: [],
    employeeStrength: [],
    investmentRange: "",
    platforms: [],
  });

  // Filter options
  const nationalityOptions = ["USA", "UK", "India", "Canada", "Germany", "France", "Australia"];
  const roleOptions = ["CEO", "CFO", "CTO", "CMO", "Director", "Manager", "Founder"];
  const industryOptions = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing"];
  const employeeStrengthOptions = ["10-25", "25-50", "50-100", "100-250", "250-500", "500+"];
  const investmentRangeOptions = ["$0-$1M", "$1M-$5M", "$5M-$10M", "$10M-$50M", "$50M+"];
  const platformOptions = ["LinkedIn", "Twitter", "Instagram", "Facebook", "Other"];

  // Helper functions
  const addFilterChip = (type: keyof SearchCriteria, value: string) => {
    if (Array.isArray(searchCriteria[type])) {
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

  const handleSearch = () => {
    setIsSearching(true);
    setIsLoading(true);
    setProgress(0);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

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
    setShowResults(false);
    setIsSearching(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(dir => dir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // Filter and sort leads
  const filteredColumns = columns.filter(col => 
    !['avatar', 'profilepic', 'profile picture', 'id'].includes(col.toLowerCase())
  );

  const sortedLeads = [...leads].sort((a, b) => {
    const valA = (a[sortField as keyof Lead] || "") as string;
    const valB = (b[sortField as keyof Lead] || "") as string;
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  // Column display names
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

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-muted/40">
        {/* Subpage Tabs */}
        {showResults && (
          <div className="flex items-center gap-2 px-6 pt-6 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${pathname === tab.path ? 'bg-primary text-white shadow-sm' : 'bg-muted text-foreground hover:bg-muted/80'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Search Interface */}
        {!isSearching && !showResults && (
          <div className="flex-1 overflow-auto p-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Find Leads
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use the filters below to find your ideal leads
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    placeholder="Enter company name"
                    value={searchCriteria.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="max-w-md"
                  />
                </div>

                {/* Filter Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Nationality */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Nationality</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {searchCriteria.companyNationality.map(nat => (
                        <Badge key={nat} variant="secondary" className="pl-3 pr-1 py-1">
                          {nat}
                          <button 
                            onClick={() => removeFilterChip("companyNationality", nat)}
                            className="ml-1 rounded-full hover:bg-accent p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nationalityOptions.filter(opt => !searchCriteria.companyNationality.includes(opt)).map(opt => (
                        <Badge 
                          key={opt} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => addFilterChip("companyNationality", opt)}
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Roles</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {searchCriteria.roles.map(role => (
                        <Badge key={role} variant="secondary" className="pl-3 pr-1 py-1">
                          {role}
                          <button 
                            onClick={() => removeFilterChip("roles", role)}
                            className="ml-1 rounded-full hover:bg-accent p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roleOptions.filter(opt => !searchCriteria.roles.includes(opt)).map(opt => (
                        <Badge 
                          key={opt} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => addFilterChip("roles", opt)}
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Industries</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {searchCriteria.industries.map(industry => (
                        <Badge key={industry} variant="secondary" className="pl-3 pr-1 py-1">
                          {industry}
                          <button 
                            onClick={() => removeFilterChip("industries", industry)}
                            className="ml-1 rounded-full hover:bg-accent p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {industryOptions.filter(opt => !searchCriteria.industries.includes(opt)).map(opt => (
                        <Badge 
                          key={opt} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => addFilterChip("industries", opt)}
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Employee Strength */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Employee Strength</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {searchCriteria.employeeStrength.map(size => (
                        <Badge key={size} variant="secondary" className="pl-3 pr-1 py-1">
                          {size}
                          <button 
                            onClick={() => removeFilterChip("employeeStrength", size)}
                            className="ml-1 rounded-full hover:bg-accent p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {employeeStrengthOptions.filter(opt => !searchCriteria.employeeStrength.includes(opt)).map(opt => (
                        <Badge 
                          key={opt} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => addFilterChip("employeeStrength", opt)}
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Investment Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Range</label>
                    <select
                      className="w-full p-2 border rounded-md text-sm"
                      value={searchCriteria.investmentRange}
                      onChange={(e) => handleInputChange("investmentRange", e.target.value)}
                    >
                      <option value="">Select investment range</option>
                      {investmentRangeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Platforms */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Platforms</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {searchCriteria.platforms.map(platform => (
                        <Badge key={platform} variant="secondary" className="pl-3 pr-1 py-1">
                          {platform}
                          <button 
                            onClick={() => removeFilterChip("platforms", platform)}
                            className="ml-1 rounded-full hover:bg-accent p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.filter(opt => !searchCriteria.platforms.includes(opt)).map(opt => (
                        <Badge 
                          key={opt} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => addFilterChip("platforms", opt)}
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleResetSearch}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleSearch}
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isSearching && !showResults && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <Card className="max-w-md w-full text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  Searching Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-2 mb-4" />
                <p className="text-sm text-muted-foreground">
                  {progress < 50 
                    ? "Gathering potential leads..." 
                    : progress < 80 
                    ? "Filtering based on your criteria..." 
                    : "Finalizing results..."}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Interface */}
        {showResults && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <button 
                      onClick={handleResetSearch}
                      className="p-1 rounded-full hover:bg-accent"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    Search Results
                  </h2>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    {leads.length} leads found
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ListFilter className="h-4 w-4" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                      <div className="space-y-4">
                        <h4 className="font-medium leading-none">Current Filters</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(searchCriteria).map(([key, value]) => {
                            if (Array.isArray(value)) {
                              return value.map(v => (
                                <Badge key={`${key}-${v}`} variant="secondary" className="pl-2 pr-1 py-0.5 text-xs">
                                  {key}: {v}
                                  <button 
                                    onClick={() => removeFilterChip(key as keyof SearchCriteria, v)}
                                    className="ml-1 rounded-full hover:bg-accent p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ));
                            } else if (value) {
                              return (
                                <Badge key={key} variant="secondary" className="pl-2 pr-1 py-0.5 text-xs">
                                  {key}: {value}
                                  <button 
                                    onClick={() => handleInputChange(key as keyof SearchCriteria, "")}
                                    className="ml-1 rounded-full hover:bg-accent p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleResetSearch}
                          className="w-full"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to List
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Campaign
                </Button>
              </div>
            </div>
            
            {/* Table */}
            <div className="flex-1 overflow-auto px-6 pb-6">
              <div className="rounded-lg border bg-background">
                <Table className="relative">
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      {filteredColumns.map(col => (
                        <TableHead
                          key={col}
                          className={cn(
                            "py-3 px-4 font-medium text-sm border-b hover:bg-muted/50 cursor-pointer",
                            sortField === col ? "text-primary" : "text-muted-foreground"
                          )}
                          onClick={() => handleSort(col)}
                        >
                          <div className="flex items-center gap-1">
                            {columnDisplayNames[col] || col}
                            <ArrowUpDown className="h-3.5 w-3.5" />
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
                            <TableCell key={col} className={`py-1 px-2 border-r border-[#E1E1F0] align-top${col === 'problem' ? ' max-w-[220px]' : ''}`}> 
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
                              ) : col === 'problem' ? (
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
        )}
      </div>
    </MainLayout>
  );
}