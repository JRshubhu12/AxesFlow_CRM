"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import sampleLeads from '../sample.json';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Download } from 'lucide-react';

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#0A66C2"/>
    <path d="M6.223 16V8.307H3.574V16h2.649zM4.899 7.18c.92 0 1.49-.611 1.49-1.374-.017-.78-.57-1.374-1.473-1.374-.903 0-1.49.594-1.49 1.374 0 .763.57 1.374 1.455 1.374h.018zm2.821 8.82h2.65v-4.355c0-.233.017-.466.086-.633.19-.467.624-.951 1.352-.951.954 0 1.336.718 1.336 1.771V16h2.65v-4.542c0-2.436-1.299-3.572-3.033-3.572-1.397 0-2.017.777-2.366 1.324h.018v-1.14H7.72c.035.74 0 7.43 0 7.43z" fill="#fff"/>
  </svg>
);

export default function ManageLeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const leads = sampleLeads;

  // Tab navigation for subpages
  const tabs = [
    { label: 'Find Leads', path: '/leads' },
    { label: 'Manage Leads', path: '/leads/manage' },
  ];

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
        {/* Manage Leads Table UI */}
        {/* Top actions row as in screenshot */}
        <div className="flex items-center gap-4 px-10 pt-2 pb-4">
          <div className="flex items-center border rounded-md px-3 py-2 bg-white w-64">
            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search"
              className="border-0 bg-transparent p-0 h-6 w-full text-sm focus:ring-0 focus:outline-none"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            {/* List View icon (grid) */}
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            List View
            <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Newest
            <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-5 w-5 text-gray-500" />
            Download CSV
          </Button>
        </div>
        <div className="flex-1 overflow-auto px-10 pb-8">
          <div className="rounded-xl border border-[#E1E1F0] bg-white">
            <Table className="min-w-full border-separate border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-[#E1E1F0]">
                  <TableHead className="w-12 px-3 bg-[#FAFAFB]" />
                  <TableHead className="py-2 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB]">Name</TableHead>
                  <TableHead className="py-2 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB]">Title</TableHead>
                  <TableHead className="py-2 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB]">Company</TableHead>
                  <TableHead className="py-2 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB]">Status</TableHead>
                  <TableHead className="py-2 px-3 font-semibold text-[#222] align-middle border-r border-[#E1E1F0] bg-[#FAFAFB]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead, idx) => (
                  <TableRow key={idx} className="border-b border-[#E1E1F0] hover:bg-[#F7F7FA]">
                    <TableCell className="w-12 px-3">
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell className="py-1 px-2 border-r border-[#E1E1F0] align-middle">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {lead.profilePic && (
                            <span className="inline-block h-8 w-8 rounded-full overflow-hidden border border-[#E1E1F0] bg-gray-100">
                              <img
                                src={lead.profilePic}
                                alt={lead.name}
                                className="h-8 w-8 object-cover"
                              />
                            </span>
                          )}
                          <span className="font-medium text-sm text-[#222] whitespace-nowrap text-ellipsis overflow-hidden block">
                            {lead.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-center min-w-[32px] pl-2">
                          <LinkedInIcon />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2 border-r border-[#E1E1F0] align-middle">
                      <span className="text-sm">{lead.title || lead["Title"] || '-'}</span>
                    </TableCell>
                    <TableCell className="py-1 px-2 border-r border-[#E1E1F0] align-middle">
                      <span className="text-sm">{lead.company || lead["Company"] || '-'}</span>
                    </TableCell>
                    <TableCell className="py-1 px-2 border-r border-[#E1E1F0] align-middle">
                      <span className="text-sm font-semibold">{lead.status || lead["Status"] || '-'}</span>
                    </TableCell>
                    <TableCell className="py-1 px-2 border-r border-[#E1E1F0] align-middle">
                      <Button className="bg-[#7F57F1] text-white px-6 py-1 rounded-md text-sm font-medium">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
