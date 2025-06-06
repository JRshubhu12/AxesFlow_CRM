'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  Mail, 
  Calendar, 
  Filter, 
  Search, 
  MoreVertical, 
  FileEdit, 
  Copy, 
  Trash2,
  BarChart2,
  Users,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { format } from 'date-fns';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const mockCampaigns = [
  {
    id: 1,
    name: 'Summer Promotion',
    type: 'Regular email',
    lastEdited: new Date(2025, 5, 6, 1, 43),
    author: 'Shubham Choudhary',
    status: 'Draft',
    audience: 'Premium Customers',
    analytics: { sent: 0, opened: 0, clicked: 0 }
  },
  {
    id: 2,
    name: 'Product Launch Announcement',
    type: 'Regular email',
    lastEdited: new Date(2025, 5, 6, 1, 38),
    author: 'Shubham Choudhary',
    status: 'Scheduled',
    audience: 'All Subscribers',
    scheduledDate: new Date(2025, 5, 8, 9, 0),
    analytics: { sent: 0, opened: 0, clicked: 0 }
  },
  {
    id: 3,
    name: 'Welcome Series #1',
    type: 'Automated',
    lastEdited: new Date(2025, 5, 5, 14, 22),
    author: 'Alex Johnson',
    status: 'Sent',
    audience: 'New Users',
    analytics: { sent: 1243, opened: 842, clicked: 321 }
  },
  {
    id: 4,
    name: 'Q3 Newsletter',
    type: 'Regular email',
    lastEdited: new Date(2025, 5, 4, 11, 15),
    author: 'Maria Rodriguez',
    status: 'Sent',
    audience: 'Active Subscribers',
    analytics: { sent: 2456, opened: 1567, clicked: 589 }
  },
  {
    id: 5,
    name: 'Black Friday Preview',
    type: 'Automated',
    lastEdited: new Date(2025, 5, 3, 16, 30),
    author: 'James Wilson',
    status: 'Scheduled',
    audience: 'VIP Members',
    scheduledDate: new Date(2025, 5, 15, 6, 0),
    analytics: { sent: 0, opened: 0, clicked: 0 }
  }
];

export default function EmailCampaignsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [tab, setTab] = useState('list');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'}>({key: 'lastEdited', direction: 'desc'});

  const filtered = mockCampaigns.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.audience.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCampaigns = [...filtered].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === 'lastEdited') {
      return sortConfig.direction === 'asc' 
        ? a.lastEdited.getTime() - b.lastEdited.getTime()
        : b.lastEdited.getTime() - a.lastEdited.getTime();
    }
    return 0;
  });

  const handleSelect = (id: number) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };
  
  const handleSelectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(c => c.id));
  };

  const getStatusVariant = (status: string) => {
    switch(status.toLowerCase()) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'default';
      case 'sent': return 'success';
      default: return 'outline';
    }
  };

  // Prepare marked dates for calendar
  const emailDateMap = mockCampaigns.reduce((acc, c) => {
    const key = c.lastEdited.toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {} as Record<string, typeof mockCampaigns>);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-1 h-3 w-3 opacity-70" /> 
      : <ArrowUpDown className="ml-1 h-3 w-3 rotate-180 opacity-70" />;
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Email Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your email marketing campaigns
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => window.location.href = '/email-campaigns/analytics-email'}>
              <BarChart2 size={16} />
              View Analytics
            </Button>
            <Link href="/email-campaigns/create-email">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                <Plus size={16} />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="list" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="border-b p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns, audiences..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 ml-auto text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 bg-white dark:bg-gray-800">
                          <Filter size={16} />
                          Filters
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Campaign Type</DropdownMenuLabel>
                        <DropdownMenuItem>All Types</DropdownMenuItem>
                        <DropdownMenuItem>Regular Email</DropdownMenuItem>
                        <DropdownMenuItem>Automated</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuItem>All Statuses</DropdownMenuItem>
                        <DropdownMenuItem>Draft</DropdownMenuItem>
                        <DropdownMenuItem>Scheduled</DropdownMenuItem>
                        <DropdownMenuItem>Sent</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {selected.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {selected.length} selected
                        </span>
                        <Button variant="outline" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                      <tr>
                        <th className="w-12 px-4 py-3 text-left">
                          <Checkbox 
                            checked={selected.length === filtered.length && filtered.length > 0} 
                            onCheckedChange={handleSelectAll} 
                          />
                        </th>
                        <th 
                          className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => requestSort('name')}
                        >
                          <div className="flex items-center">
                            Campaign
                            {getSortIcon('name')}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Audience
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Analytics
                        </th>
                        <th 
                          className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => requestSort('lastEdited')}
                        >
                          <div className="flex items-center">
                            Last Edited
                            {getSortIcon('lastEdited')}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-muted-foreground">
                            <div className="flex flex-col items-center gap-3">
                              <Mail className="h-12 w-12 text-gray-300" />
                              <h3 className="font-medium text-lg">No campaigns found</h3>
                              <p className="text-sm max-w-md">
                                Create your first campaign or adjust your search terms
                              </p>
                              <Link href="/email-campaigns/create-email">
                                <Button className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-700">
                                  <Plus size={16} />
                                  Create Campaign
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        sortedCampaigns.map(c => (
                          <tr 
                            key={c.id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-4 py-4">
                              <Checkbox 
                                checked={selected.includes(c.id)} 
                                onCheckedChange={() => handleSelect(c.id)} 
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1 min-w-[200px]">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${
                                    c.type === 'Automated' 
                                      ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                                      : 'bg-blue-100 dark:bg-blue-900/50'
                                  }`}>
                                    <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                  </div>
                                  <Link href="#" className="font-medium text-gray-900 dark:text-white hover:underline">
                                    {c.name}
                                  </Link>
                                </div>
                                <div className="flex items-center gap-2 ml-8">
                                  <Badge 
                                    variant={getStatusVariant(c.status)}
                                    className="text-xs font-normal px-2 py-0.5"
                                  >
                                    {c.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{c.type}</span>
                                </div>
                                <span className="text-xs text-muted-foreground ml-8">
                                  By {c.author}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {c.audience}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {c.analytics.sent > 0 ? (
                                <div className="flex flex-col gap-1.5 text-sm min-w-[180px]">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-medium">{c.analytics.sent.toLocaleString()}</span>
                                    <span className="text-muted-foreground">
                                      {Math.round((c.analytics.opened / c.analytics.sent) * 100)}% Open
                                    </span>
                                    <span className="text-muted-foreground">
                                      {Math.round((c.analytics.clicked / c.analytics.sent) * 100)}% CTR
                                    </span>
                                  </div>
                                  <Progress 
                                    value={Math.round((c.analytics.opened / c.analytics.sent) * 100)} 
                                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-gray-200 dark:bg-gray-800"
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col gap-1 min-w-[180px]">
                                  <span className="text-muted-foreground text-sm">Not sent yet</span>
                                  {c.status === 'Scheduled' && c.scheduledDate && (
                                    <Badge variant="outline" className="text-xs py-1 px-2 w-fit">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {format(c.scheduledDate, 'MMM dd, h:mm a')}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-muted-foreground">
                              {format(c.lastEdited, 'MMM dd, yyyy')}
                              <div className="text-xs mt-0.5">
                                {format(c.lastEdited, 'h:mm a')}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem className="gap-2">
                                    <FileEdit size={16} />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2">
                                    <Copy size={16} />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <Trash2 size={16} />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t">
                <div className="text-xs text-muted-foreground">
                  Showing <span className="font-medium">{filtered.length}</span> of <span className="font-medium">{mockCampaigns.length}</span> campaigns
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/80 border-b p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Campaign Calendar</CardTitle>
                    <CardDescription>
                      Visualize your email schedule and campaign history
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTab('list')}
                    className="mt-2 md:mt-0"
                  >
                    Return to List View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow border w-full max-w-md mx-auto">
                    <ReactCalendar
                      value={selectedDate}
                      onChange={date => setSelectedDate(date as Date)}
                      tileContent={({ date, view }) => {
                        const key = date.toDateString();
                        if (emailDateMap[key]) {
                          return (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="absolute top-1 right-1 block w-2 h-2 rounded-full bg-indigo-500"></span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {emailDateMap[key].length} campaign{emailDateMap[key].length > 1 ? 's' : ''}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        }
                        return null;
                      }}
                      tileClassName={({ date }) => 
                        `relative hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 ${date.toDateString() === new Date().toDateString() 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : ''}`
                      }
                      className="border-0 w-full text-sm"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-[300px]">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border h-full">
                      {selectedDate ? (
                        <div className="p-6">
                          <h3 className="text-lg font-semibold mb-4">
                            Campaigns on {format(selectedDate, 'MMMM d, yyyy')}
                          </h3>
                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {(emailDateMap[selectedDate.toDateString()] || []).map((c, idx) => (
                              <div 
                                key={idx} 
                                className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900/50 hover:shadow-sm transition-shadow"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg mt-1 ${
                                    c.type === 'Automated' 
                                      ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                                      : 'bg-blue-100 dark:bg-blue-900/30'
                                  }`}>
                                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium text-gray-900 dark:text-white">{c.name}</h4>
                                      <Badge variant={getStatusVariant(c.status)} className="text-xs">
                                        {c.status}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">{c.type} • {c.audience}</div>
                                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                                      <Users className="h-4 w-4 mr-1" />
                                      By {c.author}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {format(c.lastEdited, 'h:mm a')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                          <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Select a date to view campaigns
                          </h3>
                          <p className="text-muted-foreground max-w-md">
                            Click on a highlighted date to see campaigns created or scheduled on that day
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}