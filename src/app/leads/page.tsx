import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Filter, Users } from 'lucide-react';

const leadsData = [
  { id: 'L001', name: 'John Doe', company: 'Innovate Corp', email: 'john.doe@innovate.com', status: 'New', lastContact: '2024-07-20' },
  { id: 'L002', name: 'Jane Smith', company: 'Solutions Inc.', email: 'jane.smith@solutions.com', status: 'Contacted', lastContact: '2024-07-18' },
  { id: 'L003', name: 'Mike Brown', company: 'Tech Giants', email: 'mike.brown@techgiants.com', status: 'Qualified', lastContact: '2024-07-15' },
  { id: 'L004', name: 'Sarah Wilson', company: 'Future Forward', email: 'sarah.wilson@future.com', status: 'Proposal Sent', lastContact: '2024-07-10' },
  { id: 'L005', name: 'David Lee', company: 'Global Co', email: 'david.lee@global.co', status: 'Closed - Won', lastContact: '2024-07-01' },
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'default',
  'Contacted': 'secondary',
  'Qualified': 'outline', // Using outline for better visibility, primary is violet. Let's use accent color for qualified.
  'Proposal Sent': 'default', // Will be styled by primary (violet)
  'Closed - Won': 'default', // Should be success, but Badge doesn't have success variant by default. We can use primary or accent.
  'Closed - Lost': 'destructive',
};


export default function LeadsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8 text-primary" /> Potential Leads</h1>
            <p className="text-muted-foreground">Manage and track your prospective clients.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Leads List</CardTitle>
            <CardDescription>Browse through your current leads and their statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsData.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusVariantMap[lead.status] || 'default'}
                        className={
                          lead.status === 'Qualified' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 
                          lead.status === 'Closed - Won' ? 'bg-green-500 text-white hover:bg-green-600' : '' // Custom color for 'Closed - Won'
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Edit</Button>
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
