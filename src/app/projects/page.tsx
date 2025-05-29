"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Briefcase, PlusCircle, ArrowRight, CalendarIcon, ChevronRight } from 'lucide-react';
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
  status: 'In Progress' | 'Planning' | 'Completed' | 'On Hold';
  dueDate: string;
}

const initialProjectsData: Project[] = [
  { id: 'P001', name: 'Website Redesign', client: 'Alpha Corp', status: 'In Progress', dueDate: '2024-09-15', progress: 60 },
  { id: 'P002', name: 'Mobile App Development', client: 'Beta LLC', status: 'Planning', dueDate: '2024-11-01', progress: 15 },
  { id: 'P003', name: 'Marketing Campaign', client: 'Gamma Inc', status: 'Completed', dueDate: '2024-07-20', progress: 100 },
  { id: 'P004', name: 'Branding Package', client: 'Delta Co.', status: 'On Hold', dueDate: '2024-10-01', progress: 30 },
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

const getStatusFromProgress = (progress: number): Project['status'] => {
  if (progress === 100) return 'Completed';
  if (progress > 0 && progress < 100) return 'In Progress';
  if (progress === 0) return 'Planning';
  return 'Planning';
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'text-blue-500';
    case 'planning':
      return 'text-purple-500';
    case 'completed':
      return 'text-green-500';
    case 'on hold':
      return 'text-amber-500';
    default:
      return 'text-gray-500';
  }
};

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
    toast({ 
      title: "Project Created", 
      description: `${newProject.name} has been created.`,
      variant: "success"
    });
    form.reset({ name: "", client: "", dueDate: new Date(), progress: 0 });
    setIsCreateProjectOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            </div>
            <p className="text-muted-foreground">Manage all your ongoing and completed projects</p>
          </div>
          <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" /> 
                <span>New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new project
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateProjectSubmit)} className="space-y-6 py-2">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Website Redesign Q3" {...field} />
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
                            <Input placeholder="Alpha Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-6">
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
                                      <span>Select date</span>
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
                                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
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
                            <FormLabel>Progress</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" placeholder="0-100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Create Project
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">No projects yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Get started by creating a new project to manage your work and deliverables
            </p>
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 mt-4">
                  <PlusCircle className="h-4 w-4" /> 
                  <span>Create Project</span>
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:border-primary/50 transition-colors group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.client}</CardDescription>
                    </div>
                    <Badge 
                      variant={getStatusBadgeVariant(project.status)}
                      className={cn(
                        "whitespace-nowrap",
                        project.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-200' : '',
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-200' : '',
                        project.status === 'On Hold' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-200' : '',
                        project.status === 'Planning' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-200' : ''
                      )}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due date</span>
                      <span className="font-medium">{project.dueDate}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`progress-${project.id}`} className="text-sm text-muted-foreground">
                          Progress
                        </Label>
                        <span className={cn(
                          "text-sm font-medium",
                          getStatusColor(project.status)
                        )}>
                          {project.progress}%
                        </span>
                      </div>
                      <Progress 
                        value={project.progress} 
                        id={`progress-${project.id}`} 
                        className="h-2"
                        indicatorClassName={cn(
                          project.status === 'Completed' ? 'bg-green-500' : '',
                          project.status === 'In Progress' ? 'bg-blue-500' : '',
                          project.status === 'On Hold' ? 'bg-amber-500' : '',
                          project.status === 'Planning' ? 'bg-purple-500' : ''
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="w-full group-hover:bg-primary/5 justify-between"
                  >
                    <Link href={`/projects/${project.id}`}>
                      <span>View details</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}