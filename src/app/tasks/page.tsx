
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChartSquare, PlusCircle, GripVertical, CalendarIcon } from 'lucide-react';
import { useState, type DragEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { TeamMember } from '@/app/team/page'; // Import TeamMember interface

const UNASSIGNED_VALUE = "__UNASSIGNED__";

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: { name: string; avatar?: string };
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialTasksData: Task[] = [
  { id: 'task-1', title: 'Design homepage mockups for the new campaign launch focusing on Q3 deliverables', assignee: { name: 'Carol D.', avatar: 'https://placehold.co/32x32.png?text=CD' }, dueDate: '2024-08-10', priority: 'High' },
  { id: 'task-2', title: 'Develop API endpoints for user authentication and profile management', assignee: { name: 'Bob B.', avatar: 'https://placehold.co/32x32.png?text=BB' }, dueDate: '2024-08-15', priority: 'High' },
  { id: 'task-3', title: 'Write blog post about new feature', description: 'Cover benefits and how to use it. Make sure to include screenshots and a call to action.', dueDate: '2024-08-05', priority: 'Medium' },
  { id: 'task-4', title: 'Setup staging server and CI/CD pipeline', assignee: { name: 'Bob B.', avatar: 'https://placehold.co/32x32.png?text=BB' }, priority: 'Medium' },
  { id: 'task-5', title: 'Client feedback meeting preparation and agenda finalization', assignee: { name: 'Alice W.', avatar: 'https://placehold.co/32x32.png?text=AW' }, dueDate: '2024-08-02', priority: 'Low' },
];

const initialColumnsData: Column[] = [
  { id: 'todo', title: 'To Do', tasks: initialTasksData.filter((_, i) => i < 2) },
  { id: 'inprogress', title: 'In Progress', tasks: initialTasksData.filter((_, i) => i >= 2 && i < 4) },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: initialTasksData.filter((_, i) => i === 4) },
];

const priorityBadgeVariant = (priority?: 'Low' | 'Medium' | 'High'): "default" | "secondary" | "destructive" | "outline" => {
  if (priority === 'High') return 'destructive';
  if (priority === 'Medium') return 'default'; 
  return 'secondary';
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  assigneeName: z.string().optional(), // Storing the name as a string
  dueDate: z.date().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

function KanbanCard({ task }: { task: Task }) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  return (
    <Card
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      className="mb-3 p-3 shadow-md hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing bg-card group"
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-md font-semibold flex-1 break-words pr-2">{task.title}</h3>
        <GripVertical className="h-4 w-4 text-muted-foreground invisible group-hover:visible shrink-0" />
      </div>

      {task.description && <p className="text-xs text-muted-foreground mt-1 mb-2 break-words">{task.description}</p>}
      
      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
        <div>
          {task.dueDate && <span>Due: {task.dueDate}</span>}
        </div>
        {task.priority && <Badge variant={priorityBadgeVariant(task.priority)} className={task.priority === 'Medium' ? 'bg-primary text-primary-foreground' : ''}>{task.priority}</Badge>}
      </div>
      {task.assignee && (
        <div className="mt-2 flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={task.assignee.avatar} data-ai-hint="person avatar" alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.name ? task.assignee.name.slice(0,1).toUpperCase() : 'N'}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{task.assignee.name}</span>
        </div>
      )}
    </Card>
  );
}

export default function TasksPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [availableAssignees, setAvailableAssignees] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedColumns = localStorage.getItem('kanbanColumns');
    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    } else {
      setColumns(initialColumnsData);
      localStorage.setItem('kanbanColumns', JSON.stringify(initialColumnsData));
    }

    const storedTeamMembers = localStorage.getItem('teamMembers');
    if (storedTeamMembers) {
      setAvailableAssignees(JSON.parse(storedTeamMembers));
    }
  }, []);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      assigneeName: "", // Keep as empty string for placeholder to work correctly
      priority: "Medium",
      dueDate: undefined,
    },
  });

  const handleAddTaskSubmit = (values: TaskFormValues) => {
    const assigneeNameValue = values.assigneeName && values.assigneeName !== UNASSIGNED_VALUE ? values.assigneeName : undefined;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: values.title,
      description: values.description,
      assignee: assigneeNameValue ? { name: assigneeNameValue, avatar: `https://placehold.co/32x32.png?text=${assigneeNameValue.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}` } : undefined,
      dueDate: values.dueDate ? format(values.dueDate, "yyyy-MM-dd") : undefined,
      priority: values.priority,
    };

    const updatedColumns = columns.map(column => {
      if (column.id === 'todo') { 
        return { ...column, tasks: [newTask, ...column.tasks] }; 
      }
      return column;
    });
    
    setColumns(updatedColumns);
    localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
    toast({ title: "Task Added", description: `${newTask.title} has been added to To Do.` });
    form.reset({ 
        title: "", 
        description: "", 
        assigneeName: "", // Reset to empty string to show placeholder
        priority: "Medium",
        dueDate: undefined 
    });
    setIsAddTaskOpen(false);
  };


  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    let taskToMove: Task | undefined;
    let sourceColumnId: string | undefined;

    const newColumnsState = columns.map(col => {
      const taskIndex = col.tasks.findIndex(t => t.id === taskId);
      if (taskIndex > -1) {
        taskToMove = col.tasks[taskIndex];
        sourceColumnId = col.id;
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      return col;
    });

    if (!taskToMove || !sourceColumnId || sourceColumnId === targetColumnId) {
        if (!taskToMove && taskId) {
            console.warn("Task to move not found, but taskId was present. TaskId:", taskId);
        }
        return; 
    }
    
    const finalColumns = newColumnsState.map(col => {
      if (col.id === targetColumnId && taskToMove) {
        // Add to the beginning of the target column's tasks array
        return { ...col, tasks: [taskToMove, ...col.tasks] };
      }
      return col;
    });
    
    setColumns(finalColumns);
    localStorage.setItem('kanbanColumns', JSON.stringify(finalColumns));
  };

  return (
    <MainLayout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><GanttChartSquare className="h-8 w-8 text-primary" /> Task Board</h1>
            <p className="text-muted-foreground">Visualize and manage your team&apos;s tasks.</p>
          </div>
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new task.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddTaskSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Finalize proposal" {...field} />
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
                          <Textarea placeholder="Add more details about the task" {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assigneeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignee (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an assignee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Team Members</SelectLabel>
                              <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                              {availableAssignees.map((member) => (
                                <SelectItem key={member.id} value={member.name}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date (Optional)</FormLabel>
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
                              disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1)) 
                              }
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
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Task</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {columns.map(column => (
            <div
              key={column.id}
              className="bg-muted/50 p-4 rounded-lg shadow-inner min-w-[300px] flex flex-col h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h2 className="text-lg font-semibold mb-4 px-1 text-foreground">{column.title} ({column.tasks.length})</h2>
              <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {column.tasks.length > 0 ? (
                  column.tasks.map(task => <KanbanCard key={task.id} task={task} />)
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
    

    