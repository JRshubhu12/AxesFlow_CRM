"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Briefcase, PlusCircle, ArrowRight, CalendarIcon, ChevronRight, GanttChart, Users, Clock, CheckCircle, AlertCircle, ChevronDown, Search } from 'lucide-react';
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
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters."),
  client: z.string().min(2, "Client name must be at least 2 characters."),
  dueDate: z.date({ required_error: "Due date is required." }),
  progress: z.coerce.number().min(0).max(100, "Progress must be between 0 and 100."),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export interface Project extends Omit<ProjectFormValues, 'dueDate'> {
  id: string;
  status: 'In Progress' | 'Planning' | 'Completed' | 'On Hold';
  dueDate: string;
  teamMembers?: string[];
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

const initialProjectsData: Project[] = [
  { 
    id: 'P001', 
    name: 'Website Redesign', 
    client: 'Alpha Corp', 
    status: 'In Progress', 
    dueDate: '2024-09-15', 
    progress: 60,
    description: 'Complete redesign of company website with modern UI/UX',
    teamMembers: ['JD', 'AS', 'MP'],
    priority: 'High'
  },
  { 
    id: 'P002', 
    name: 'Mobile App Development', 
    client: 'Beta LLC', 
    status: 'Planning', 
    dueDate: '2024-11-01', 
    progress: 15,
    description: 'Cross-platform mobile application for customer engagement',
    teamMembers: ['TM', 'JD'],
    priority: 'Critical'
  },
  { 
    id: 'P003', 
    name: 'Marketing Campaign', 
    client: 'Gamma Inc', 
    status: 'Completed', 
    dueDate: '2024-07-20', 
    progress: 100,
    description: 'Q3 digital marketing campaign for product launch',
    teamMembers: ['AS', 'MP', 'TM'],
    priority: 'Medium'
  },
  { 
    id: 'P004', 
    name: 'Branding Package', 
    client: 'Delta Co.', 
    status: 'On Hold', 
    dueDate: '2024-10-01', 
    progress: 30,
    description: 'Complete rebranding including logo, colors and guidelines',
    teamMembers: ['JD', 'MP'],
    priority: 'Low'
  },
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

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'bg-red-500/10 text-red-600 dark:text-red-400';
    case 'high':
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    case 'low':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
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
      return 'text-blue-500 dark:text-blue-400';
    case 'planning':
      return 'text-purple-500 dark:text-purple-400';
    case 'completed':
      return 'text-green-500 dark:text-green-400';
    case 'on hold':
      return 'text-amber-500 dark:text-amber-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return <GanttChart className="h-4 w-4" />;
    case 'planning':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'on hold':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "MMM dd, yyyy");
};

const getPriorityIcon = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />;
    case 'high':
      return <div className="w-2 h-2 rounded-full bg-orange-500" />;
    case 'medium':
      return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
    case 'low':
      return <div className="w-2 h-2 rounded-full bg-green-500" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-gray-500" />;
  }
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(initialProjectsData);
        localStorage.setItem('projects', JSON.stringify(initialProjectsData));
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      client: "",
      dueDate: new Date(),
      progress: 0,
      description: "",
    },
  });

  const handleCreateProjectSubmit = (values: ProjectFormValues) => {
    const newProject: Project = {
      id: `P${Date.now().toString().slice(-6)}`,
      name: values.name,
      client: values.client,
      dueDate: format(values.dueDate, "yyyy-MM-dd"),
      progress: values.progress,
      status: getStatusFromProgress(values.progress),
      description: values.description,
      teamMembers: [],
      priority: 'Medium',
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    toast({ 
      title: "Project Created", 
      description: `${newProject.name} has been successfully created.`,
      variant: "default",
      action: (
        <Button variant="ghost" size="sm" onClick={() => {
          navigator.clipboard.writeText(newProject.id);
          toast({ description: "Project ID copied to clipboard!" });
        }}>
          Copy ID
        </Button>
      )
    });
    form.reset({ name: "", client: "", dueDate: new Date(), progress: 0, description: "" });
    setIsCreateProjectOpen(false);
  };

  const stats = [
    { name: 'Total Projects', value: projects.length, icon: Briefcase, change: '+12%', trend: 'up' },
    { name: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, icon: GanttChart, change: '+3', trend: 'up' },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, icon: CheckCircle, change: '5 this month', trend: 'neutral' },
    { name: 'Overdue', value: projects.filter(p => isBefore(parseISO(p.dueDate), new Date()) && p.status !== 'Completed').length, icon: AlertCircle, change: '-2', trend: 'down' },
  ];

  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(project.status);
    
    // Priority filter
    const matchesPriority = priorityFilter.length === 0 || (project.priority && priorityFilter.includes(project.priority));
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusOptions = ['In Progress', 'Planning', 'Completed', 'On Hold'];
  const priorityOptions = ['Critical', 'High', 'Medium', 'Low'];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Project Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage all your ongoing and completed projects</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-1">
                  <span>Status</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {statusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, status]);
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== status));
                      }
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-1">
                  <span>Priority</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {priorityOptions.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, priority]);
                      } else {
                        setPriorityFilter(priorityFilter.filter((p) => p !== priority));
                      }
                    }}
                  >
                    {priority}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" /> 
                  <span>New Project</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
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
                              <Input placeholder="Website Redesign Q3" {...field} className="h-10" />
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
                              <Input placeholder="Alpha Corp" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <textarea
                                placeholder="Brief project description..."
                                {...field}
                                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
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
                                        "w-full pl-3 text-left font-normal h-10",
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
                              <FormLabel>Initial Progress</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    placeholder="0-100" 
                                    {...field} 
                                    className="h-10"
                                  />
                                  <span className="text-muted-foreground text-sm">%</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full h-10">
                        Create Project
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={cn(
                    "text-xs flex items-center",
                    stat.trend === 'up' ? 'text-green-500' : '',
                    stat.trend === 'down' ? 'text-red-500' : '',
                    stat.trend === 'neutral' ? 'text-gray-500' : ''
                  )}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-gradient-to-b from-muted/10 to-muted/30 rounded-lg border border-dashed">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">No projects found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm || statusFilter.length > 0 || priorityFilter.length > 0 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating a new project to manage your work and deliverables"}
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
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:border-primary/50 transition-colors group hover:shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Users className="h-3 w-3 opacity-70" />
                        <span className="line-clamp-1">{project.client}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant={getStatusBadgeVariant(project.status)}
                        className={cn(
                          "whitespace-nowrap flex items-center gap-1",
                          project.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-200' : '',
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-200' : '',
                          project.status === 'On Hold' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-200' : '',
                          project.status === 'Planning' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-200' : ''
                        )}
                      >
                        {getStatusIcon(project.status)}
                        {project.status}
                      </Badge>
                      {project.priority && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            getPriorityColor(project.priority),
                            "flex items-center gap-1"
                          )}
                        >
                          {getPriorityIcon(project.priority)}
                          {project.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                        Due date
                      </span>
                      <span className={cn(
                        "font-medium",
                        isBefore(parseISO(project.dueDate), new Date()) && project.status !== 'Completed' 
                          ? 'text-red-500 dark:text-red-400' 
                          : ''
                      )}>
                        {formatDate(project.dueDate)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`progress-${project.id}`} className="text-sm text-muted-foreground flex items-center gap-1">
                          <GanttChart className="h-3.5 w-3.5 opacity-70" />
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
                        className={cn(
                          'h-2 rounded-full',
                          project.status === 'Completed' ? 'bg-green-500' : '',
                          project.status === 'In Progress' ? 'bg-blue-500' : '',
                          project.status === 'On Hold' ? 'bg-amber-500' : '',
                          project.status === 'Planning' ? 'bg-purple-500' : ''
                        )}
                      />
                    </div>
                    {project.teamMembers && project.teamMembers.length > 0 && (
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 opacity-70" />
                          Team
                        </Label>
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 3).map((member, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="h-8 w-8 border-2 border-background hover:z-10 hover:scale-110 transition-transform">
                                    <AvatarFallback className="text-xs">
                                      {member}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{member}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          {project.teamMembers.length > 3 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="h-8 w-8 border-2 border-background hover:z-10 hover:scale-110 transition-transform">
                                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                      +{project.teamMembers.length - 3}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{project.teamMembers.slice(3).join(', ')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="w-full justify-between bg-transparent hover:bg-[#6D69C9] hover:text-white transition-colors"
                  >
                    <Link href={`/projects/${project.id}`}>
                      <span>View details</span>
                      <ChevronRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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