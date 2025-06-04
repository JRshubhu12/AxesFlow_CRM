"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO, isAfter, isToday, differenceInDays } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { DollarSign, CalendarIcon, TrendingUp, AlertCircle, Receipt, Eye, Download, Search, Filter, ChevronDown, BarChart, CreditCard, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the Invoice interface
export interface Invoice {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  dueDate: string; // Stored as YYYY-MM-DD string
  status: 'Paid' | 'Pending' | 'Overdue';
  issuedDate: string;
}

const invoiceSchema = z.object({
  clientName: z.string().min(2, { message: "Client name must be at least 2 characters." }),
  projectName: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  dueDate: z.date({ required_error: "Due date is required." }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const initialInvoicesData: Invoice[] = [
  {id: 'INV-001', clientName: 'Alpha Solutions', projectName: 'Q1 Consulting', amount: 250000, dueDate: '2024-08-15', status: 'Paid', issuedDate: '2024-06-01'},
  {id: 'INV-002', clientName: 'Beta Innovations', projectName: 'Website Development', amount: 120000, dueDate: '2024-09-01', status: 'Pending', issuedDate: '2024-06-10'},
  {id: 'INV-003', clientName: 'Gamma Services', projectName: 'Marketing Campaign', amount: 300000, dueDate: '2024-07-20', status: 'Overdue', issuedDate: '2024-05-15'},
  {id: 'INV-004', clientName: 'Delta Tech', projectName: 'Cloud Migration', amount: 175000, dueDate: '2024-08-30', status: 'Pending', issuedDate: '2024-06-05'},
  {id: 'INV-005', clientName: 'Epsilon Systems', projectName: 'UI/UX Design', amount: 90000, dueDate: '2024-07-10', status: 'Overdue', issuedDate: '2024-05-20'},
  {id: 'INV-006', clientName: 'Zeta Analytics', projectName: 'Data Analysis', amount: 210000, dueDate: '2024-09-15', status: 'Pending', issuedDate: '2024-06-15'},
];

const LOCAL_STORAGE_KEY = 'financeInvoices';

export default function FinancePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isViewInvoiceOpen, setIsViewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(5);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  useEffect(() => {
    const storedInvoices = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
    } else {
      setInvoices(initialInvoicesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialInvoicesData));
    }
  }, []);

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    return invoices.reduce((acc, invoice) => {
      acc.totalRevenue += invoice.amount;
      
      if (invoice.status === 'Pending') {
        acc.pendingAmount += invoice.amount;
        acc.pendingCount++;
      } else if (invoice.status === 'Overdue') {
        acc.overdueAmount += invoice.amount;
        acc.overdueCount++;
      } else if (invoice.status === 'Paid') {
        acc.paidAmount += invoice.amount;
        acc.paidCount++;
      }
      
      return acc;
    }, {
      totalRevenue: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      paidAmount: 0,
      pendingCount: 0,
      overdueCount: 0,
      paidCount: 0,
    });
  }, [invoices]);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(inv => 
        inv.clientName.toLowerCase().includes(term) || 
        inv.projectName.toLowerCase().includes(term) ||
        inv.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(inv => inv.status === statusFilter);
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [invoices, searchTerm, statusFilter, sortConfig]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      projectName: '',
      amount: undefined,
      dueDate: undefined,
    },
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsLoading(true);
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: data.clientName,
      projectName: data.projectName,
      amount: data.amount,
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
      status: 'Pending',
      issuedDate: format(new Date(), "yyyy-MM-dd"),
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedInvoices));

    toast({
      title: "Invoice Generated",
      description: `Invoice for ${newInvoice.clientName} - ${newInvoice.projectName} created.`,
    });
    form.reset();
    setIsLoading(false);
  };

  const getInvoiceStatusBadge = (status: Invoice['status'], dueDate: string) => {
    const due = parseISO(dueDate);
    const daysUntilDue = differenceInDays(due, new Date());
    
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Paid</Badge>;
      case 'pending':
        if (isAfter(new Date(), due)) {
          return <Badge variant="destructive">Overdue</Badge>;
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  Pending{daysUntilDue >= 0 ? ` (${daysUntilDue}d)` : ''}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Due in {daysUntilDue} days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openViewModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewInvoiceOpen(true);
  };

  const downloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.id} has been downloaded as PDF.`,
    });
  };

  const requestSort = (key: keyof Invoice) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Invoice) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Mock data for revenue chart
  const revenueData = [
    { month: 'Jan', revenue: 1250000 },
    { month: 'Feb', revenue: 1890000 },
    { month: 'Mar', revenue: 1420000 },
    { month: 'Apr', revenue: 1780000 },
    { month: 'May', revenue: 2010000 },
    { month: 'Jun', revenue: financialMetrics.totalRevenue },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  );

  useEffect(() => {
    // Reset to first page if filter/search changes and current page is out of range
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredInvoices, totalPages]);

  const markAsPaid = (invoice: Invoice) => {
    const updatedInvoices = invoices.map(inv =>
      inv.id === invoice.id ? { ...inv, status: 'Paid' } : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedInvoices));
    toast({
      title: 'Invoice Marked as Paid',
      description: `Invoice ${invoice.id} is now marked as Paid.`,
    });
    setIsViewInvoiceOpen(false);
  };

  const confirmDeleteInvoice = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  };

  const deleteInvoice = () => {
    if (!invoiceToDelete) return;
    const updatedInvoices = invoices.filter(inv => inv.id !== invoiceToDelete.id);
    setInvoices(updatedInvoices);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedInvoices));
    toast({
      title: 'Invoice Deleted',
      description: `Invoice ${invoiceToDelete.id} has been deleted.`,
    });
    setIsDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="h-8 w-8 text-primary font-semibold text-3xl">₹</span>
              Finance Hub
            </h1>
            <p className="text-muted-foreground">Manage invoices and track financial performance</p>
          </div>
          <Button className="gap-2" onClick={() => setIsNewInvoiceOpen(true)}>
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
        </div>

        {/* New Invoice Modal */}
        <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create New Invoice
              </DialogTitle>
            </DialogHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => { onSubmit(data); setIsNewInvoiceOpen(false); })} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name / Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Website Redesign Q3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                            <Input 
                              className="pl-8" 
                              type="number" 
                              placeholder="e.g., 125000.00" 
                              {...field} 
                              step="0.01" 
                            />
                          </div>
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Invoice'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </DialogContent>
        </Dialog>

        {/* Delete Invoice Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Invoice</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete invoice {invoiceToDelete?.id}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={deleteInvoice}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Invoice Dialog */}
        <Dialog open={isViewInvoiceOpen} onOpenChange={setIsViewInvoiceOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Invoice Details: {selectedInvoice?.id}
              </DialogTitle>
              <DialogDescription>
                Issued on {selectedInvoice ? format(parseISO(selectedInvoice.issuedDate), "PPP") : ''}
              </DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Client</h3>
                    <p className="text-lg">{selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Project</h3>
                    <p className="text-lg">{selectedInvoice.projectName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Amount</h3>
                    <p className="text-2xl font-bold">₹{selectedInvoice.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Status</h3>
                    <div className="text-lg">
                      {getInvoiceStatusBadge(selectedInvoice.status, selectedInvoice.dueDate)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Issued Date</h3>
                    <p className="text-lg">{format(parseISO(selectedInvoice.issuedDate), "PPP")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Due Date</h3>
                    <p className="text-lg">{format(parseISO(selectedInvoice.dueDate), "PPP")}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Payment Method</h3>
                    <p className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Bank Transfer
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => downloadInvoice(selectedInvoice)}>
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="destructive" className="gap-2" onClick={() => confirmDeleteInvoice(selectedInvoice)}>
                      <Trash2 className="h-4 w-4 text-red-500" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" onClick={() => selectedInvoice && markAsPaid(selectedInvoice)} disabled={selectedInvoice?.status === 'Paid'}>
                Mark as Paid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Total Revenue</span>
                    <span className="h-4 w-4 text-primary font-semibold">₹</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{financialMetrics.totalRevenue.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground mt-1">+15.2% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Paid Invoices</span>
                    <Badge className="bg-green-500 hover:bg-green-600">{financialMetrics.paidCount}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{financialMetrics.paidAmount.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground mt-1">100% collection rate</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Pending Payments</span>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">{financialMetrics.pendingCount}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{financialMetrics.pendingAmount.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {financialMetrics.overdueCount > 0 ? `${financialMetrics.overdueCount} invoices overdue` : 'No overdue invoices'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Overdue Payments</span>
                    <Badge variant="destructive">{financialMetrics.overdueCount}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{financialMetrics.overdueAmount.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground mt-1">Needs immediate attention</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription>Monthly revenue performance for the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between h-48 gap-2 mt-6">
                      {revenueData.map((data, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center flex-1">
                                <div
                                  className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-lg"
                                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                                />
                                <span className="text-xs mt-2 text-muted-foreground">{data.month}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>₹{data.revenue.toLocaleString('en-IN')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span>Revenue (₹)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    Invoice Generator
                  </CardTitle>
                  <CardDescription>Create and send invoices to your clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Acme Corp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name / Description</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Website Redesign Q3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (₹)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                <Input 
                                  className="pl-8" 
                                  type="number" 
                                  placeholder="e.g., 125000.00" 
                                  {...field} 
                                  step="0.01" 
                                />
                              </div>
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
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Invoice'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices" className="space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-primary" />
                      Invoice Management
                    </CardTitle>
                    <CardDescription>
                      {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-12 bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div 
                      className="col-span-2 flex items-center cursor-pointer"
                      onClick={() => requestSort('id')}
                    >
                      Invoice ID {getSortIcon('id')}
                    </div>
                    <div 
                      className="col-span-3 flex items-center cursor-pointer"
                      onClick={() => requestSort('clientName')}
                    >
                      Client {getSortIcon('clientName')}
                    </div>
                    <div className="col-span-3">Project</div>
                    <div 
                      className="col-span-2 flex items-center cursor-pointer"
                      onClick={() => requestSort('amount')}
                    >
                      Amount {getSortIcon('amount')}
                    </div>
                    <div 
                      className="col-span-2 flex items-center cursor-pointer"
                      onClick={() => requestSort('dueDate')}
                    >
                      Due Date {getSortIcon('dueDate')}
                    </div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  
                  <div className="divide-y">
                    {paginatedInvoices.length > 0 ? (
                      paginatedInvoices.map(invoice => (
                        <div 
                          key={invoice.id} 
                          className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-blue-50 transition-colors group"
                        >
                          <div className="col-span-2 font-medium text-primary flex items-center">
                            {invoice.id}
                          </div>
                          <div className="col-span-3">{invoice.clientName}</div>
                          <div className="col-span-3 text-muted-foreground">{invoice.projectName}</div>
                          <div className="col-span-2 font-medium">₹{invoice.amount.toLocaleString('en-IN')}</div>
                          <div className="col-span-2 flex items-center justify-between">
                            <div>
                              {isToday(parseISO(invoice.dueDate)) ? (
                                <span className="text-orange-500">Today</span>
                              ) : (
                                format(parseISO(invoice.dueDate), "dd MMM")
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {getInvoiceStatusBadge(invoice.status, invoice.dueDate)}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => openViewModal(invoice)}
                                className="h-8 w-8 opacity-70 group-hover:opacity-100"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => confirmDeleteInvoice(invoice)}
                                className="h-8 w-8 opacity-70 group-hover:opacity-100"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">No invoices found</div>
                        <Button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* Summary Row */}
                  <div className="grid grid-cols-12 px-4 py-2 bg-muted/30 text-sm font-semibold border-t">
                    <div className="col-span-2">Total</div>
                    <div className="col-span-3"></div>
                    <div className="col-span-3"></div>
                    <div className="col-span-2">₹{paginatedInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('en-IN')}</div>
                    <div className="col-span-2"></div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                {/* Pagination Controls */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedInvoices.length} of {filteredInvoices.length} filtered invoices (Total: {invoices.length})
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                    <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                      Next
                    </Button>
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