"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import sampleLeads from '../sample.json';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Download, Eye, Edit2, Mail, Trash2, Link2, Plus, Filter, Search, RefreshCw, MoreVertical } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#0A66C2" />
    <path d="M6.223 16V8.307H3.574V16h2.649zM4.899 7.18c.92 0 1.49-.611 1.49-1.374-.017-.78-.57-1.374-1.473-1.374-.903 0-1.49.594-1.49 1.374 0 .763.57 1.374 1.455 1.374h.018zm2.821 8.82h2.65v-4.355c0-.233.017-.466.086-.633.19-.467.624-.951 1.352-.951.954 0 1.336.718 1.336 1.771V16h2.65v-4.542c0-2.436-1.299-3.572-3.033-3.572-1.397 0-2.017.777-2.366 1.324h.018v-1.14H7.72c.035.74 0 7.43 0 7.43z" fill="#fff" />
  </svg>
);

// Utility for color based on status
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "active":
      return "bg-green-100 text-green-800 border-green-300";
    case "inactive":
      return "bg-red-100 text-red-800 border-red-300";
    case "contacted":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function ManageLeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const allLeads = sampleLeads;

  // UI controls states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [sortByNewest, setSortByNewest] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());

  // Tab navigation for subpages
  const tabs = [
    { label: 'Found Leads', path: '/leads/found-leads' },
    { label: 'Manage Leads', path: '/leads/manage' },
  ];

  // Filtered and sorted leads based on search, filter, and sorting
  const leads = useMemo(() => {
    let filtered = allLeads;

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        (lead.name?.toLowerCase().includes(lowerQuery) ||
          (lead.title?.toLowerCase().includes(lowerQuery)) ||
          (lead.company?.toLowerCase().includes(lowerQuery)) ||
          (lead.email?.toLowerCase().includes(lowerQuery)))
      );
    }

    if (selectedStatusFilter) {
      filtered = filtered.filter(lead => (lead.status || lead["Status"] || '').toLowerCase() === selectedStatusFilter.toLowerCase());
    }

    filtered = filtered.sort((a, b) => {
      if (sortByNewest) {
        return (new Date(b.created_at || b.createdAt || 0).getTime()) - (new Date(a.created_at || a.createdAt || 0).getTime());
      } else {
        return (new Date(a.created_at || a.createdAt || 0).getTime()) - (new Date(b.created_at || b.createdAt || 0).getTime());
      }
    });

    return filtered;
  }, [allLeads, searchQuery, selectedStatusFilter, sortByNewest]);

  // Tab navigation action functions (stubbed for demo)
  const handleView = (lead) => {
    alert(`Viewing details for: ${lead.name}`);
  };
  const handleEdit = (lead) => {
    alert(`Edit feature for: ${lead.name}`);
  };
  const handleEmail = (lead) => {
    window.location.href = `mailto:${lead.email}`;
  };
  const handleDelete = (lead) => {
    if (confirm(`Are you sure you want to delete ${lead.name}? This action cannot be undone.`)) {
      alert(`Delete action for: ${lead.name}`);
    }
  };

  const toggleSelectLead = (idx: number) => {
    setSelectedLeads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const selectAllLeads = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map((_, idx) => idx)));
    }
  };

  // Status filter options
  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Bulk actions
  const handleBulkDelete = () => {
    if (selectedLeads.size === 0) {
      alert("No leads selected for deletion.");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedLeads.size} selected leads? This action cannot be undone.`)) {
      alert(`Deleted ${selectedLeads.size} leads.`);
      setSelectedLeads(new Set());
    }
  };

  const handleBulkEmail = () => {
    if (selectedLeads.size === 0) {
      alert("No leads selected to email.");
      return;
    }
    const emails = Array.from(selectedLeads).map(i => leads[i].email).filter(Boolean).join(',');
    window.location.href = `mailto:${emails}`;
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        {/* Subpage Tabs */}
        <div className="flex items-center gap-3 px-10 pt-8 pb-2 border-b border-gray-300">
          {tabs.map(tab => (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={cn(
                "px-5 py-2 rounded-lg font-semibold text-base transition-colors duration-150 shadow-md",
                pathname === tab.path
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              aria-current={pathname === tab.path ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto flex items-center gap-2 text-indigo-700 hover:bg-indigo-700 hover:text-white transition-colors"
            onClick={() => router.push('/leads')}
            aria-label="Add New Lead"
          >
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        </div>

        {/* Top controls: Search, Status filter, Sorting, Bulk Actions */}
        <div className="flex flex-wrap items-center gap-4 px-10 pt-6 pb-4 justify-between border-b border-gray-300">
          {/* Left controls: Search, Status filter, Sorting */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-72">
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, title, company, email..."
                aria-label="Search leads"
                className="pl-10"
                type="search"
                spellCheck={false}
                autoComplete="off"
              />
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              {searchQuery && (
                <button
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  {selectedStatusFilter ? statusOptions.find(s => s.value === selectedStatusFilter)?.label : 'Filter Status'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-40">
                <div className="flex flex-col gap-1">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSelectedStatusFilter(option.value === '' ? null : option.value)
                      }
                      className={cn(
                        "text-left px-3 py-2 rounded hover:bg-indigo-100",
                        selectedStatusFilter === option.value || (option.value === '' && !selectedStatusFilter)
                          ? "bg-indigo-200 font-semibold text-indigo-900"
                          : "text-gray-700"
                      )}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort by Newest/Oldest */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  {sortByNewest ? 'Newest' : 'Oldest'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-32">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setSortByNewest(true)}
                    className={cn(
                      "text-left px-3 py-2 rounded hover:bg-indigo-100",
                      sortByNewest ? "bg-indigo-200 font-semibold text-indigo-900" : "text-gray-700"
                    )}
                    type="button"
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortByNewest(false)}
                    className={cn(
                      "text-left px-3 py-2 rounded hover:bg-indigo-100",
                      !sortByNewest ? "bg-indigo-200 font-semibold text-indigo-900" : "text-gray-700"
                    )}
                    type="button"
                  >
                    Oldest
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={() => {
              setSearchQuery('');
              setSelectedStatusFilter(null);
              setSortByNewest(true);
              setSelectedLeads(new Set());
            }} aria-label="Reset filters" className="flex items-center gap-1 text-gray-600 hover:text-indigo-700">
              <RefreshCw className="h-4 w-4" /> Reset
            </Button>
          </div>

          {/* Right controls: Bulk Actions */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 select-none">{selectedLeads.size} selected</span>
            <Button
              variant="destructive"
              size="sm"
              disabled={selectedLeads.size === 0}
              onClick={handleBulkDelete}
              aria-label="Bulk delete selected leads"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={selectedLeads.size === 0}
              onClick={handleBulkEmail}
              aria-label="Bulk email selected leads"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="group flex items-center gap-2 hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white"
              onClick={() => {
                // TODO: Implement export filtered leads as CSV
                alert('Export CSV feature coming soon!');
              }}
              aria-label="Download filtered leads CSV"
            >
              <Download className="h-5 w-5 text-gray-500 group-hover:text-white group-focus:text-white" />
              Download CSV
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-10 pb-8">
          <div className="rounded-xl border border-gray-300 bg-white shadow-lg">
            <Table className="min-w-full border-separate border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-gray-300 bg-indigo-50">
                  <TableHead className="w-12 px-3">
                    <input
                      type="checkbox"
                      onChange={selectAllLeads}
                      checked={selectedLeads.size === leads.length && leads.length > 0}
                      aria-label="Select all leads"
                      className="cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-indigo-900 align-middle border-r border-gray-300 select-none">Name</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-indigo-900 align-middle border-r border-gray-300 select-none">Title</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-indigo-900 align-middle border-r border-gray-300 select-none">Company</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-indigo-900 align-middle border-r border-gray-300 select-none">Status</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-indigo-900 align-middle border-r border-gray-300 select-none">Last Contacted</TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-indigo-900 align-middle select-none">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">No leads found matching criteria.</TableCell>
                  </TableRow>
                )}
                {leads.map((lead, idx) => {
                  // Support both string and object keys for status
                  const status = lead.status || lead["Status"] || "";
                  // Color for status
                  let statusColor = getStatusColor(status);

                  // Formatted last contacted date
                  const lastContacted = lead.last_contacted || lead.lastContacted || lead.updated_at || lead.updatedAt || null;
                  const lastContactedDisplay = lastContacted
                    ? new Date(lastContacted).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                    : '-';

                  return (
                    <TableRow key={idx} className={cn(
                      "border-b border-gray-300 hover:bg-indigo-50 transition-colors cursor-pointer",
                      selectedLeads.has(idx) && "bg-indigo-100"
                    )}
                      onDoubleClick={() => handleView(lead)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleView(lead);
                        }
                      }}
                      aria-selected={selectedLeads.has(idx)}
                    >
                      <TableCell className="w-12 px-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(idx)}
                          onChange={() => toggleSelectLead(idx)}
                          aria-label={`Select lead ${lead.name}`}
                          onClick={e => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="py-2 px-4 border-r border-gray-300 align-middle">
                        <div className="flex items-center gap-3 min-w-0">
                          {lead.profilePic ? (
                            <img
                              src={lead.profilePic}
                              alt={lead.name}
                              className="h-10 w-10 rounded-full object-cover border border-gray-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-300">
                              {lead.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-indigo-900 truncate">{lead.name}</span>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-sm text-indigo-600 hover:underline truncate"
                              title={lead.email}
                              onClick={e => e.stopPropagation()}
                            >
                              {lead.email}
                            </a>
                          </div>
                          <div title="LinkedIn Profile" className="ml-auto pr-1">
                            {lead.linkedin_url && (
                              <a
                                href={lead.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                              >
                                <LinkedInIcon />
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 border-r border-gray-300 align-middle">
                        <span className="text-indigo-800 text-sm">{lead.title || lead["Title"] || '-'}</span>
                      </TableCell>
                      <TableCell className="py-2 px-4 border-r border-gray-300 align-middle">
                        <span className="text-indigo-800 text-sm">{lead.company || lead["Company"] || '-'}</span>
                      </TableCell>
                      <TableCell className="py-2 px-4 border-r border-gray-300 align-middle">
                        <span
                          className={`text-xs font-semibold rounded border px-2 py-1 inline-block ${statusColor} select-none`}
                          title={`Status: ${status}`}
                        >
                          {status || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 px-4 border-r border-gray-300 align-middle">
                        <span className="text-sm text-indigo-700 select-none">{lastContactedDisplay}</span>
                      </TableCell>
                      <TableCell className="py-2 px-4 align-middle">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${lead.name}`}
                              onClick={e => e.stopPropagation()}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-2 w-48">
                            <div className="flex flex-col gap-1">
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 rounded text-sm text-indigo-900 w-full text-left"
                                onClick={() => handleView(lead)}
                                type="button"
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </button>
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 rounded text-sm text-indigo-900 w-full text-left"
                                onClick={() => handleEdit(lead)}
                                type="button"
                              >
                                <Edit2 className="h-4 w-4" /> Edit Lead
                              </button>
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 rounded text-sm text-indigo-900 w-full text-left"
                                onClick={() => handleEmail(lead)}
                                type="button"
                              >
                                <Mail className="h-4 w-4" /> Send Email
                              </button>
                              {lead.linkedin_url && (
                                <a
                                  href={lead.linkedin_url}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 rounded text-sm text-indigo-900 w-full text-left"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Link2 className="h-4 w-4" /> View LinkedIn
                                </a>
                              )}
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded text-sm text-red-600 w-full text-left"
                                onClick={() => handleDelete(lead)}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" /> Delete Lead
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}