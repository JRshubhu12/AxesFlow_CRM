import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users2, UserPlus, MessageSquarePlus } from 'lucide-react';

const teamMembersData = [
  { id: 'T001', name: 'Alice Wonderland', role: 'Project Manager', email: 'alice@example.com', tasksAssigned: 5, avatar: 'https://placehold.co/40x40.png?text=AW', status: 'Active' },
  { id: 'T002', name: 'Bob The Builder', role: 'Lead Developer', email: 'bob@example.com', tasksAssigned: 8, avatar: 'https://placehold.co/40x40.png?text=BB', status: 'Active' },
  { id: 'T003', name: 'Carol Danvers', role: 'UX Designer', email: 'carol@example.com', tasksAssigned: 3, avatar: 'https://placehold.co/40x40.png?text=CD', status: 'Active' },
  { id: 'T004', name: 'Dave Lister', role: 'QA Tester', email: 'dave@example.com', tasksAssigned: 2, avatar: 'https://placehold.co/40x40.png?text=DL', status: 'Inactive' },
];

export default function TeamPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Users2 className="h-8 w-8 text-primary" /> Team Members</h1>
            <p className="text-muted-foreground">Manage your agency&apos;s team and assign tasks.</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>View all team members and their current assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tasks Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembersData.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-center">{member.tasksAssigned}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'Active' ? 'default' : 'destructive'} className={member.status === 'Active' ? 'bg-green-500 text-white hover:bg-green-600' : ''}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <MessageSquarePlus className="mr-1 h-3 w-3" /> Assign Task
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View Profile</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
