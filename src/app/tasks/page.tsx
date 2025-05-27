"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChartSquare, PlusCircle, GripVertical } from 'lucide-react';
import { useState, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  { id: 'task-1', title: 'Design homepage mockups', assignee: { name: 'Carol D.', avatar: 'https://placehold.co/32x32.png?text=CD' }, dueDate: '2024-08-10', priority: 'High' },
  { id: 'task-2', title: 'Develop API endpoints for user auth', assignee: { name: 'Bob B.', avatar: 'https://placehold.co/32x32.png?text=BB' }, dueDate: '2024-08-15', priority: 'High' },
  { id: 'task-3', title: 'Write blog post about new feature', description: 'Cover benefits and how to use it.', dueDate: '2024-08-05', priority: 'Medium' },
  { id: 'task-4', title: 'Setup staging server', assignee: { name: 'Bob B.', avatar: 'https://placehold.co/32x32.png?text=BB' }, priority: 'Medium' },
  { id: 'task-5', title: 'Client feedback meeting prep', assignee: { name: 'Alice W.', avatar: 'https://placehold.co/32x32.png?text=AW' }, dueDate: '2024-08-02', priority: 'Low' },
];

const initialColumnsData: Column[] = [
  { id: 'todo', title: 'To Do', tasks: initialTasksData.filter((_, i) => i < 2) },
  { id: 'inprogress', title: 'In Progress', tasks: initialTasksData.filter((_, i) => i >= 2 && i < 4) },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: initialTasksData.filter((_, i) => i === 4) },
];


const priorityBadgeVariant = (priority?: 'Low' | 'Medium' | 'High'): "default" | "secondary" | "destructive" | "outline" => {
  if (priority === 'High') return 'destructive';
  if (priority === 'Medium') return 'default'; // Primary color (violet)
  return 'secondary';
}


function KanbanCard({ task }: { task: Task }) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  return (
    <Card 
      draggable 
      onDragStart={(e) => handleDragStart(e, task.id)}
      className="mb-3 p-3 shadow-md hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing bg-card"
    >
      <CardTitle className="text-md mb-1 flex justify-between items-center">
        {task.title}
        <GripVertical className="h-4 w-4 text-muted-foreground invisible group-hover:visible" />
      </CardTitle>
      {task.description && <CardDescription className="text-xs mb-2">{task.description}</CardDescription>}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {task.dueDate && <span>Due: {task.dueDate}</span>}
        </div>
        {task.priority && <Badge variant={priorityBadgeVariant(task.priority)}>{task.priority}</Badge>}
      </div>
      {task.assignee && (
        <div className="mt-2 flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={task.assignee.avatar} data-ai-hint="person avatar"/>
            <AvatarFallback>{task.assignee.name.slice(0,1)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{task.assignee.name}</span>
        </div>
      )}
    </Card>
  );
}

export default function TasksPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumnsData);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setColumns(prevColumns => {
      let taskToMove: Task | undefined;
      let sourceColumnId: string | undefined;

      // Find and remove task from source column
      const newColumns = prevColumns.map(col => {
        const taskIndex = col.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
          taskToMove = col.tasks[taskIndex];
          sourceColumnId = col.id;
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        return col;
      });

      if (!taskToMove || sourceColumnId === targetColumnId) return prevColumns; // No move if same column or task not found

      // Add task to target column
      return newColumns.map(col => {
        if (col.id === targetColumnId && taskToMove) {
          return { ...col, tasks: [...col.tasks, taskToMove] };
        }
        return col;
      });
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><GanttChartSquare className="h-8 w-8 text-primary" /> Task Board</h1>
            <p className="text-muted-foreground">Visualize and manage your team&apos;s tasks.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
          </Button>
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
              <div className="flex-grow overflow-y-auto space-y-3 pr-1 group"> {/* Added group class for hover effects on cards */}
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
