
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, MoreVertical, TrendingUp, Search, ListFilter, Plus, Briefcase, CheckSquare, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useState, useEffect } from 'react';

const kpiData = [
  {
    title: 'Total Leads',
    value: '2371',
    trend: '+8%',
    trendDescription: 'To the last month',
    icon: Users,
  },
  {
    title: 'Total Projects',
    value: '152', // Changed value for differentiation
    trend: '+5%',  // Changed trend for differentiation
    trendDescription: 'To the last month',
    icon: Briefcase, // Changed icon
  },
];

const revenueData = [
  { name: '1', revenue: 4000 },
  { name: '2', revenue: 3000 },
  { name: '3', revenue: 2000 },
  { name: '4', revenue: 2780 },
  { name: '5', revenue: 1890 },
  { name: '6', revenue: 2390 },
  { name: '7', revenue: 3490 },
  { name: '8', revenue: 4300 },
];

const myTasksData = [
  {
    id: 'task1',
    title: 'Create Email Campaign',
    description: 'Create email campaigns for leads and schedule it for first message and automate follow ups.',
    tags: ['Web Design', 'Web Dev', 'Social Media'],
  },
  {
    id: 'task2',
    title: 'Finalize Q3 Report',
    description: 'Compile all data and finalize the quarterly report for stakeholders.',
    tags: ['Reporting', 'Analytics'],
  },
  {
    id: 'task3',
    title: 'Client Onboarding - Acme Corp',
    description: 'Prepare onboarding materials and schedule kick-off call.',
    tags: ['Client Management', 'Onboarding'],
  },
];

const upcomingMeetingsData = [
  {
    id: 'meet1',
    date: '30 May 2025',
    meetingName: 'Project11C Final Meeting',
    joinees: [
      { name: 'AA', avatar: 'https://placehold.co/32x32.png?text=AA' },
      { name: 'BB', avatar: 'https://placehold.co/32x32.png?text=BB' },
      { name: 'CC', avatar: 'https://placehold.co/32x32.png?text=CC' },
      { name: 'DD', avatar: 'https://placehold.co/32x32.png?text=DD' },
    ],
    host: 'Sashwat Sawarn',
  },
  {
    id: 'meet2',
    date: '30 May 2025',
    meetingName: 'Project11C Final Meeting',
    joinees: [
      { name: 'EE', avatar: 'https://placehold.co/32x32.png?text=EE' },
      { name: 'FF', avatar: 'https://placehold.co/32x32.png?text=FF' },
    ],
    host: 'Sashwat Sawarn',
  },
    {
    id: 'meet3',
    date: '02 Jun 2025',
    meetingName: 'Marketing Strategy Brainstorm',
    joinees: [
      { name: 'GG', avatar: 'https://placehold.co/32x32.png?text=GG' },
      { name: 'HH', avatar: 'https://placehold.co/32x32.png?text=HH' },
      { name: 'II', avatar: 'https://placehold.co/32x32.png?text=II' },
    ],
    host: 'Jane Doe',
  },
];

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // This runs only on the client, preventing hydration mismatch for Date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-GB', options).replace(/ /g, ' ')); // e.g., 29 May 2025
  }, []);


  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Top Section: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <kpi.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{kpi.title}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500">{kpi.trend}</span>
                  <span className="ml-1">{kpi.trendDescription}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section: Revenue Chart & My Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 pr-6 pb-6 pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`}/>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    itemStyle={{ color: "hsl(var(--primary))" }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
              {currentDate && (
                <Badge variant="default" className="bg-primary text-primary-foreground h-7 px-3 text-xs">
                  {currentDate}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {myTasksData.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>
                    ))}
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    View Task
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Upcoming Meetings */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="pl-9 h-9 text-sm" />
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
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead>Meeting Name</TableHead>
                  <TableHead className="w-[180px]">Joinees</TableHead>
                  <TableHead className="w-[180px]">Host</TableHead>
                  <TableHead className="text-right w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingMeetingsData.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.date}</TableCell>
                    <TableCell>{meeting.meetingName}</TableCell>
                    <TableCell>
                      <div className="flex items-center -space-x-2">
                        {meeting.joinees.slice(0, 4).map((joinee, i) => (
                          <Avatar key={i} className="h-7 w-7 border-2 border-card hover:z-10" title={joinee.name}>
                            <AvatarImage src={joinee.avatar} data-ai-hint="person avatar" alt={joinee.name} />
                            <AvatarFallback>{joinee.name.substring(0,1)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {meeting.joinees.length > 4 && (
                          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-muted-foreground text-xs font-medium border-2 border-card z-10">
                            +{meeting.joinees.length - 4}
                          </div>
                        )}
                        {meeting.joinees.length === 0 && <span className="text-xs text-muted-foreground">No joinees</span> }
                      </div>
                    </TableCell>
                    <TableCell>{meeting.host}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {upcomingMeetingsData.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6">No upcoming meetings.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
