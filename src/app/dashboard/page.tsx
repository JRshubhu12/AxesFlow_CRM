"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Users, MoreVertical, TrendingUp, Search, ListFilter, Plus, Briefcase, CheckSquare, Mail, MessageSquare, Calendar
} from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { useState, useEffect } from 'react';

const kpiData = [
  {
    title: 'Total Leads',
    value: '2,371',
    trend: '+8%',
    trendDescription: 'vs last month',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100/80',
  },
  {
    title: 'Active Projects',
    value: '152', 
    trend: '+5%',
    trendDescription: 'vs last month',
    icon: Briefcase,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100/80',
  },
  {
    title: 'Tasks Completed',
    value: '84%',
    trend: '+12%',
    trendDescription: 'vs last month',
    icon: CheckSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100/80',
  },
  {
    title: 'Revenue Target',
    value: '78%',
    trend: '+3%',
    trendDescription: 'vs last month',
    icon: TrendingUp,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100/80',
  },
];

const revenueData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const projectStatusData = [
  { name: 'Planning', value: 15 },
  { name: 'In Progress', value: 42 },
  { name: 'On Hold', value: 8 },
  { name: 'Completed', value: 35 },
];

const myTasksData = [
  {
    id: 'task1',
    title: 'Create Email Campaign',
    description: 'Create email campaigns for leads and schedule it for first message and automate follow ups.',
    tags: ['Web Design', 'Web Dev', 'Social Media'],
    priority: 'high',
    dueDate: 'Today',
  },
  {
    id: 'task2',
    title: 'Finalize Q3 Report',
    description: 'Compile all data and finalize the quarterly report for stakeholders.',
    tags: ['Reporting', 'Analytics'],
    priority: 'medium',
    dueDate: 'Tomorrow',
  },
  {
    id: 'task3',
    title: 'Client Onboarding - Acme Corp',
    description: 'Prepare onboarding materials and schedule kick-off call.',
    tags: ['Client Management'],
    priority: 'high',
    dueDate: 'Today',
  },
];

const upcomingMeetingsData = [
  {
    id: 'meet1',
    date: '30 May 2025',
    time: '09:30 AM',
    meetingName: 'Project11C Final Review',
    joinees: [
      { name: 'Alex Anderson', avatar: 'https://placehold.co/32x32.png?text=AA' },
      { name: 'Blake Brown', avatar: 'https://placehold.co/32x32.png?text=BB' },
      { name: 'Casey Clark', avatar: 'https://placehold.co/32x32.png?text=CC' },
      { name: 'Dana Davis', avatar: 'https://placehold.co/32x32.png?text=DD' },
    ],
    host: 'Sashwat Sawarn',
    duration: '1h',
  },
  {
    id: 'meet2',
    date: '30 May 2025',
    time: '02:00 PM',
    meetingName: 'Marketing Strategy Q3',
    joinees: [
      { name: 'Evan Evans', avatar: 'https://placehold.co/32x32.png?text=EE' },
      { name: 'Finley Ford', avatar: 'https://placehold.co/32x32.png?text=FF' },
    ],
    host: 'Sashwat Sawarn',
    duration: '1.5h',
  },
  {
    id: 'meet3',
    date: '02 Jun 2025',
    time: '10:15 AM',
    meetingName: 'Product Roadmap Discussion',
    joinees: [
      { name: 'Glen Green', avatar: 'https://placehold.co/32x32.png?text=GG' },
      { name: 'Harper Hill', avatar: 'https://placehold.co/32x32.png?text=HH' },
      { name: 'Irene Ivy', avatar: 'https://placehold.co/32x32.png?text=II' },
    ],
    host: 'Jane Doe',
    duration: '45m',
  },
];

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [activeChart, setActiveChart] = useState('revenue');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <TooltipProvider>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">{currentDate}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
              <Button className="gap-2">
                <Mail className="h-4 w-4" />
                View Messages
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                  </div>
                  <div className={`rounded-lg p-3 ${kpi.bgColor}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">{kpi.trend}</span>
                    <span className="ml-1">{kpi.trendDescription}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue/Expenses Chart */}
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg font-semibold">Financial Overview</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={activeChart === 'revenue' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveChart('revenue')}
                  >
                    Revenue
                  </Button>
                  <Button 
                    variant={activeChart === 'projects' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveChart('projects')}
                  >
                    Projects
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pl-2 pr-6 pb-6 pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  {activeChart === 'revenue' ? (
                    <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <RechartsTooltip
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))", 
                          borderRadius: "var(--radius)",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        }}
                        formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Expenses']}
                        labelStyle={{ 
                          color: "hsl(var(--foreground))",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                        itemStyle={{ 
                          color: "hsl(var(--primary))",
                          fontSize: 12,
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "hsl(var(--primary))" }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "#8884d8" }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={projectStatusData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <RechartsTooltip
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))", 
                          borderRadius: "var(--radius)",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        }}
                        labelStyle={{ 
                          color: "hsl(var(--foreground))",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                        itemStyle={{ 
                          color: "hsl(var(--primary))",
                          fontSize: 12,
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tasks Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg font-semibold">Priority Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {myTasksData.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Meetings Section */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings for the next 7 days</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search meetings..." 
                    className="pl-9 h-9 text-sm w-full" 
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9">
                  <ListFilter className="mr-1.5 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date & Time</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead className="w-[180px]">Participants</TableHead>
                    <TableHead className="w-[120px]">Duration</TableHead>
                    <TableHead className="w-[100px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingMeetingsData.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{meeting.date}</div>
                        <div className="text-xs text-muted-foreground">{meeting.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{meeting.meetingName}</div>
                        <div className="text-xs text-muted-foreground">Host: {meeting.host}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center -space-x-2">
                          {meeting.joinees.slice(0, 4).map((joinee, i) => (
                            <Tooltip key={i}>
                              <TooltipTrigger asChild>
                                <Avatar className="h-7 w-7 border-2 border-card hover:z-10">
                                  <AvatarImage src={joinee.avatar} alt={joinee.name} />
                                  <AvatarFallback>{joinee.name.substring(0,1)}</AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{joinee.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {meeting.joinees.length > 4 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-muted-foreground text-xs font-medium border-2 border-card z-10">
                                  +{meeting.joinees.length - 4}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>And {meeting.joinees.length - 4} more</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{meeting.duration}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {upcomingMeetingsData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No meetings scheduled</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    Schedule a meeting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </TooltipProvider>
  );
}