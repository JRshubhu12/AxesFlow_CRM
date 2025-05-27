import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Button variant="outline" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Project Detail: {params.id}</CardTitle>
            <CardDescription>This is a placeholder for the detailed view of project {params.id}.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Further details about the project, tasks, team members, files, and communication related to project {params.id} would be displayed here.</p>
            <ul className="list-disc list-inside mt-4 space-y-1 text-muted-foreground">
                <li>Task Management Section</li>
                <li>Team Allocation Overview</li>
                <li>File Repository</li>
                <li>Client Communication Log</li>
                <li>Progress Tracking & Analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
