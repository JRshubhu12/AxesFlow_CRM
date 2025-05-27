
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Briefcase, PlusCircle, ArrowRight, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters."),
  client: z.string().min(2, "Client name must be at least 2 characters."),
  dueDate: z.date({ required_error: "Due date is required." }),
  progress: z.coerce.number().min(0).max(100, "Progress must be between 0 and 100."),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export interface Project extends Omit<ProjectFormValues, 'dueDate'> {
  id: string;
  status: 'In Progress' | 'Planning' | 'Completed' | 'On Hold'; // Status derived from progress or set manually
  dueDate: string; // Store as YYYY-MM-DD string
}

const initialProjectsData: Project[] = [
  { id: 'P001', name: 'Website Redesign for Alpha Corp', client: 'Alpha Corp', status: 'In Progress', dueDate: '2024-09-15', progress: 60 },
  { id: 'P002', name: 'Mobile App Development for Beta LLC', client: 'Beta LLC', status: 'Planning', dueDate: '2024-11-01', progress: 15 },
  { id: 'P003', name: 'Marketing Campaign for Gamma Inc.', client: 'Gamma Inc', status: 'Completed', dueDate: '2024-07-20', progress: 100 },
  { id: 'P004', name: 'Branding for Delta Co.', client: 'Delta Co.', status: 'On Hold', dueDate: '2024-10-01', progress: 30 },
];

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'default';
    case 'planning':
      return 'secondary';
    case 'completed':
      return 'default'; 
    case 'on hold':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Helper to determine status from progress
const getStatusFromProgress = (progress: number): Project['status'] => {
  if (progress === 100) return 'Completed';
  if (progress > 0 && progress < 100) return 'In Progress';
  if (progress === 0) return 'Planning';
  return 'Planning'; // Default or handle 'On Hold' manually if needed
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(initialProjectsData);
      localStorage.setItem('projects', JSON.stringify(initialProjectsData));
    }
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      client: "",
      dueDate: new Date(),
      progress: 0,
    },
  });

  const handleCreateProjectSubmit = (values: ProjectFormValues) => {
    const newProject: Project = {
      id: `P${Date.now()}`,
      name: values.name,
      client: values.client,
      dueDate: format(values.dueDate, "yyyy-MM-dd"),
      progress: values.progress,
      status: getStatusFromProgress(values.progress),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    toast({ title: "Project Created", description: `${newProject.name} has been created.` });
    form.reset({ name: "", client: "", dueDate: new Date(), progress: 0 });
    setIsCreateProjectOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Briefcase className="h-8 w-8 text-primary" /> Projects</h1>
            <p className="text-muted-foreground">Oversee all your ongoing and completed projects.</p>
          </div>
          <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new project. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateProjectSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Website Redesign Q3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Alpha Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" placeholder="e.g., 25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Project</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
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
