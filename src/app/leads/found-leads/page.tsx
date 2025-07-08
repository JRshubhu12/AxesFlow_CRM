"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ChevronLeft, Download, Plus, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import sampleLeads from '../sample.json';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="hover:opacity-80 transition-opacity">
    <rect width="20" height="20" rx="4" fill="#0A66C2"/>
    <path d="M6.223 16V8.307H3.574V16h2.649zM4.899 7.18c.92 0 1.49-.611 1.49-1.374-.017-.78-.57-1.374-1.473-1.374-.903 0-1.49.594-1.49 1.374 0 .763.57 1.374 1.455 1.374h.018zm2.821 8.82h2.65v-4.355c0-.233.017-.466.086-.633.19-.467.624-.951 1.352-.951.954 0 1.336.718 1.336 1.771V16h2.65v-4.542c0-2.436-1.299-3.572-3.033-3.572-1.397 0-2.017.777-2.366 1.324h.018v-1.14H7.72c.035.74 0 7.43 0 7.43z" fill="#fff"/>
  </svg>
);

export default function FoundLeadsPage() {
  const router = useRouter();
  const leads = sampleLeads;
  const columns = leads.length > 0 ? Object.keys(leads[0]) : [];
  const filteredColumns = columns.filter(col => !['avatar', 'profilepic', 'profile picture', 'id'].includes(col.toLowerCase()));
  const [sortField, setSortField] = useState(filteredColumns[0] || "name");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc");

  const sortedLeads = [...leads].sort((a, b) => {
    const valA = (a[sortField] || "") as string;
    const valB = (b[sortField] || "") as string;
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-muted/40">
        <div className="flex items-center gap-2 px-6 pt-6 pb-2">
          <button onClick={() => router.back()} className="p-1 rounded-full hover:bg-accent">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Found Leads</h2>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => router.push('/leads/manage')}
          >
            Manage Leads
          </Button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {leads.length} leads found
              </Badge>
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
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">(Filters UI here)</div>
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
                        onClick={() => setSortField(col)}
                      >
                        <div className="flex items-center gap-1">
                          {col}
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
      </div>
    </MainLayout>
  );
}
