import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Briefcase, PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

const projectsData = [
  { id: 'P001', name: 'Website Redesign for Alpha Corp', client: 'Alpha Corp', status: 'In Progress', dueDate: '2024-09-15', progress: 60 },
  { id: 'P002', name: 'Mobile App Development for Beta LLC', client: 'Beta LLC', status: 'Planning', dueDate: '2024-11-01', progress: 15 },
  { id: 'P003', name: 'Marketing Campaign for Gamma Inc.', client: 'Gamma Inc', status: 'Completed', dueDate: '2024-07-20', progress: 100 },
  { id: 'P004', name: 'Branding for Delta Co.', client: 'Delta Co.', status: 'On Hold', dueDate: '2024-10-01', progress: 30 },
];

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'default'; // Primary color (violet)
    case 'planning':
      return 'secondary';
    case 'completed':
      return 'default'; // Should be success, using accent (sky blue)
    case 'on hold':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Briefcase className="h-8 w-8 text-primary" /> Projects</h1>
            <p className="text-muted-foreground">Oversee all your ongoing and completed projects.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsData.map((project) => (
            <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge 
                    variant={getStatusBadgeVariant(project.status)}
                    className={project.status === 'Completed' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>Client: {project.client} | Due: {project.dueDate}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <Label htmlFor={`progress-${project.id}`} className="text-sm text-muted-foreground">Progress: {project.progress}%</Label>
                  <Progress value={project.progress} id={`progress-${project.id}`} aria-label={`${project.name} progress ${project.progress}%`} />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/projects/${project.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
