"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileData {
  id: string;
  name: string;
  type: 'Document' | 'Archive' | 'Image' | string;
  size: string;
  uploaded: string;
  status: 'Shared' | 'Internal' | 'Draft';
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

const initialTeamRooms: TeamRoom[] = [
  {
    id: 'team1',
    name: 'Design Team',
    files: [
      { id: 'F001', name: 'Project Alpha Proposal.pdf', type: 'Document', size: '2.5 MB', uploaded: '2024-07-25', status: 'Shared' },
      { id: 'F002', name: 'Logo Assets.zip', type: 'Archive', size: '10 MB', uploaded: '2024-07-20', status: 'Internal' },
    ],
  },
  {
    id: 'team2',
    name: 'Development Team',
    files: [
      { id: 'F003', name: 'API Docs.pdf', type: 'Document', size: '1.2 MB', uploaded: '2024-07-28', status: 'Shared' },
      { id: 'F004', name: 'Sprint Plan.xlsx', type: 'Document', size: '800 KB', uploaded: '2024-07-29', status: 'Draft' },
    ],
  },
  {
    id: 'team3',
    name: 'Marketing Team',
    files: [
      { id: 'F005', name: 'Campaign Brief.docx', type: 'Document', size: '300 KB', uploaded: '2024-07-30', status: 'Shared' },
    ],
  },
];

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
      { id: 'F001', name: 'UI Kit.pdf', type: 'Document', size: '2.1 MB', uploaded: '2024-07-10', status: 'Shared' },
      { id: 'F002', name: 'Wireframes.sketch', type: 'Image', size: '4.2 MB', uploaded: '2024-07-12', status: 'Internal' },
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
      { id: 'F003', name: 'API Docs.pdf', type: 'Document', size: '1.2 MB', uploaded: '2024-07-28', status: 'Shared' },
      { id: 'F004', name: 'Sprint Plan.xlsx', type: 'Document', size: '800 KB', uploaded: '2024-07-29', status: 'Draft' },
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
      { id: 'F005', name: 'Campaign Brief.docx', type: 'Document', size: '300 KB', uploaded: '2024-07-30', status: 'Shared' },
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
      { id: 'F006', name: 'Brand Guide.pdf', type: 'Document', size: '2.5 MB', uploaded: '2024-07-25', status: 'Shared' },
      { id: 'F007', name: 'Logo Assets.zip', type: 'Archive', size: '10 MB', uploaded: '2024-07-20', status: 'Internal' },
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
      { id: 'F008', name: 'Sales Report Q2.xlsx', type: 'Document', size: '1.1 MB', uploaded: '2024-07-15', status: 'Shared' },
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
      { id: 'F009', name: 'Support Playbook.pdf', type: 'Document', size: '2.0 MB', uploaded: '2024-07-18', status: 'Internal' },
    ],
  },
];

export default function UploadsPage() {
  const [teamRooms, setTeamRooms] = useState<TeamRoom[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    setTeamRooms(initialTeamRooms);
    setTeams(initialTeams);
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="py-10 px-8 w-full max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Team Uploads</h1>
            <p className="text-muted-foreground">Browse and manage files for each team </p>
          </div>
        </div>
        <Input
          placeholder="Search teams..."
          className="mb-6 max-w-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeams.map(team => (
            <Card key={team.id} className="border shadow-sm cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/uploads/${team.id}`)}
            >
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex items-center gap-2">
                  {team.isStarred && <Star className="w-5 h-5 text-yellow-500" fill="#facc15" />}
                  <CardTitle className="text-2xl font-bold leading-tight">{team.name}</CardTitle>
                </div>
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <CardDescription className="mb-3 text-base">{team.description}</CardDescription>
                <div className="flex items-center gap-2 mb-1">
                  {team.members.map(member => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-white -ml-2 first:ml-0">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}