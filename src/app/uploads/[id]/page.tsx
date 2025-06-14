"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, UploadCloud, Search } from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface FileData {
  id: string;
  name: string;
  type: 'Document' | 'Archive' | 'Image' | string;
  size: string;
  uploaded: string;
  status: 'Shared' | 'Internal' | 'Draft';
  sender: TeamMember;
  sentAt: string; // ISO string
}

interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  isStarred?: boolean;
  files: FileData[];
}

const initialTeams: Team[] = [
  {
    id: 'frontend-wizards',
    name: 'Frontend Wizards',
    description: 'Building beautiful UIs.',
    isStarred: true,
    members: [
      { id: '1', name: 'Alice', avatarUrl: '/images/user1.png' },
      { id: '2', name: 'Bob', avatarUrl: '/images/user2.png' },
      { id: '3', name: 'Carol', avatarUrl: '/images/user3.png' },
      { id: '4', name: 'Dave', avatarUrl: '/images/user4.png' },
    ],
    files: [
      { id: 'F001', name: 'UI Kit.pdf', type: 'Document', size: '2.1 MB', uploaded: '2024-07-10', status: 'Shared', sender: { id: '1', name: 'Alice', avatarUrl: '/images/user1.png' }, sentAt: '2024-07-10T10:00:00Z' },
      { id: 'F002', name: 'Wireframes.sketch', type: 'Image', size: '4.2 MB', uploaded: '2024-07-12', status: 'Internal', sender: { id: '2', name: 'Bob', avatarUrl: '/images/user2.png' }, sentAt: '2024-07-12T10:00:00Z' },
    ],
  },
  {
    id: 'backend-gurus',
    name: 'Backend Gurus',
    description: 'API and database experts.',
    members: [
      { id: '5', name: 'Eve', avatarUrl: '/images/user5.png' },
      { id: '6', name: 'Frank', avatarUrl: '/images/user6.png' },
      { id: '7', name: 'Grace', avatarUrl: '/images/user7.png' },
      { id: '8', name: 'Heidi', avatarUrl: '/images/user8.png' },
    ],
    files: [
      { id: 'F003', name: 'API Docs.pdf', type: 'Document', size: '1.2 MB', uploaded: '2024-07-28', status: 'Shared', sender: { id: '5', name: 'Eve', avatarUrl: '/images/user5.png' }, sentAt: '2024-07-28T10:00:00Z' },
      { id: 'F004', name: 'Sprint Plan.xlsx', type: 'Document', size: '800 KB', uploaded: '2024-07-29', status: 'Draft', sender: { id: '6', name: 'Frank', avatarUrl: '/images/user6.png' }, sentAt: '2024-07-29T10:00:00Z' },
    ],
  },
  {
    id: 'product-masters',
    name: 'Product Masters',
    description: 'Product strategy and management.',
    members: [
      { id: '9', name: 'Ivan', avatarUrl: '/images/user9.png' },
      { id: '10', name: 'Judy', avatarUrl: '/images/user10.png' },
      { id: '11', name: 'Ken', avatarUrl: '/images/user11.png' },
    ],
    files: [
      { id: 'F005', name: 'Campaign Brief.docx', type: 'Document', size: '300 KB', uploaded: '2024-07-30', status: 'Shared', sender: { id: '9', name: 'Ivan', avatarUrl: '/images/user9.png' }, sentAt: '2024-07-30T10:00:00Z' },
    ],
  },
  {
    id: 'design-dreamers',
    name: 'Design Dreamers',
    description: 'Creative design team.',
    members: [
      { id: '1', name: 'Alice', avatarUrl: '/images/user1.png' },
      { id: '3', name: 'Carol', avatarUrl: '/images/user3.png' },
      { id: '4', name: 'Dave', avatarUrl: '/images/user4.png' },
    ],
    files: [
      { id: 'F006', name: 'Brand Guide.pdf', type: 'Document', size: '2.5 MB', uploaded: '2024-07-25', status: 'Shared', sender: { id: '1', name: 'Alice', avatarUrl: '/images/user1.png' }, sentAt: '2024-07-25T10:00:00Z' },
      { id: 'F007', name: 'Logo Assets.zip', type: 'Archive', size: '10 MB', uploaded: '2024-07-20', status: 'Internal', sender: { id: '3', name: 'Carol', avatarUrl: '/images/user3.png' }, sentAt: '2024-07-20T10:00:00Z' },
    ],
  },
  {
    id: 'sales-stars',
    name: 'Sales Stars',
    description: 'Top sales performers.',
    isStarred: true,
    members: [
      { id: '12', name: 'Leo', avatarUrl: '/images/user12.png' },
      { id: '13', name: 'Mona', avatarUrl: '/images/user13.png' },
    ],
    files: [
      { id: 'F008', name: 'Sales Report Q2.xlsx', type: 'Document', size: '1.1 MB', uploaded: '2024-07-15', status: 'Shared', sender: { id: '12', name: 'Leo', avatarUrl: '/images/user12.png' }, sentAt: '2024-07-15T10:00:00Z' },
    ],
  },
  {
    id: 'support-squad',
    name: 'Support Squad',
    description: 'Customer support heroes.',
    members: [
      { id: '12', name: 'Leo', avatarUrl: '/images/user12.png' },
      { id: '13', name: 'Mona', avatarUrl: '/images/user13.png' },
    ],
    files: [
      { id: 'F009', name: 'Support Playbook.pdf', type: 'Document', size: '2.0 MB', uploaded: '2024-07-18', status: 'Internal', sender: { id: '13', name: 'Mona', avatarUrl: '/images/user13.png' }, sentAt: '2024-07-18T10:00:00Z' },
    ],
  },
];

export default function TeamUploadsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setTeams(initialTeams);
  }, []);

  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full py-20">
          <h2 className="text-2xl font-semibold mb-4">Team not found</h2>
          <Button onClick={() => router.push("/uploads")}>Back to Teams</Button>
        </div>
      </MainLayout>
    );
  }

  // Filtering logic
  const filteredFiles = team.files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesStatus = filterStatus === 'all' || file.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      // Use the first team member as the sender for the uploaded file
      const sender = team.members[0];
      const newFiles: FileData[] = Array.from(files).map((file, idx) => ({
        id: Date.now() + idx + "",
        name: file.name,
        type: 'Document', // Default type for uploads
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploaded: new Date().toISOString().slice(0, 10),
        status: 'Internal', // Default status for uploads
        sender,
        sentAt: new Date().toISOString(),
      }));
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId ? { ...t, files: [...newFiles, ...t.files] } : t
        )
      );
      setUploading(false);
    }, 800);
  };

  const handleDelete = (fileId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, files: t.files.filter(f => f.id !== fileId) } : t
      )
    );
  };

  return (
    <MainLayout>
      <div className="py-10 px-8 w-full max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/uploads")}>{"<"}</Button>
          <span className="text-3xl font-bold align-middle ml-2">{team.name} Files</span>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="border rounded px-2 py-1 text-sm ml-2"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Document">Document</option>
            <option value="Archive">Archive</option>
            <option value="Image">Image</option>
          </select>
          <select
            className="border rounded px-2 py-1 text-sm ml-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Shared">Shared</option>
            <option value="Internal">Internal</option>
            <option value="Draft">Draft</option>
          </select>
          <label className="ml-auto inline-flex items-center cursor-pointer">
            <Input type="file" className="hidden" multiple onChange={handleUpload} disabled={uploading} />
            <Button variant="outline" asChild disabled={uploading}>
              <span><UploadCloud className="w-5 h-5 mr-2" /> Upload</span>
            </Button>
          </label>
        </div>
        <div className="bg-white rounded-lg shadow p-0 border">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-10 h-10 text-muted-foreground mb-2 mx-auto" />
              <span className="text-muted-foreground">No files found.</span>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between px-6 py-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage src={file.sender.avatarUrl} alt={file.sender.name} />
                    <AvatarFallback>{file.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">{file.name}
                      <span className="ml-2 text-xs text-muted-foreground">{file.type}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold">{file.sender.name}</span>
                      <span>• {file.size}</span>
                      <span>• {file.status}</span>
                      <span>• {new Date(file.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button variant="destructive" size="icon" title="Delete" onClick={() => handleDelete(file.id)}>
                    ×
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

