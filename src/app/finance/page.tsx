
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
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { DollarSign, CalendarIcon, TrendingUp, AlertCircle, Receipt, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the Invoice interface
export interface Invoice {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  dueDate: string; // Stored as YYYY-MM-DD string
  status: 'Paid' | 'Pending' | 'Overdue';
}

const invoiceSchema = z.object({
  clientName: z.string().min(2, { message: "Client name must be at least 2 characters." }),
  projectName: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  dueDate: z.date({ required_error: "Due date is required." }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const initialInvoicesData: Invoice[] = [
  {id: 'INV-INIT-001', clientName: 'Alpha Solutions', projectName: 'Q1 Consulting', amount: 250000, dueDate: '2024-08-15', status: 'Paid'},
  {id: 'INV-INIT-002', clientName: 'Beta Innovations', projectName: 'Website Development', amount: 120000, dueDate: '2024-09-01', status: 'Pending'},
  {id: 'INV-INIT-003', clientName: 'Gamma Services', projectName: 'Marketing Campaign', amount: 300000, dueDate: '2024-07-20', status: 'Overdue'},
];

const LOCAL_STORAGE_KEY = 'financeInvoices';

export default function FinancePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isViewInvoiceOpen, setIsViewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const storedInvoices = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
    } else {
      setInvoices(initialInvoicesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialInvoicesData));
    }
  }, []);

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
      id: `INV-${Date.now()}`,
      clientName: data.clientName,
      projectName: data.projectName,
      amount: data.amount,
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
      status: 'Pending', // New invoices are pending by default
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

  const getInvoiceStatusBadge = (status: Invoice['status']) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
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

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="h-8 w-8 text-primary font-semibold text-3xl">₹</span>
              Finance Hub
            </h1>
            <p className="text-muted-foreground">Manage invoices and track financial performance.</p>
          </div>
        </div>

        {/* View Invoice Dialog */}
        <Dialog open={isViewInvoiceOpen} onOpenChange={setIsViewInvoiceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invoice Details: {selectedInvoice?.id}</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="py-4 space-y-3">
                <div><strong className="font-medium">Client:</strong> {selectedInvoice.clientName}</div>
                <div><strong className="font-medium">Project:</strong> {selectedInvoice.projectName}</div>
                <div><strong className="font-medium">Amount:</strong> ₹{selectedInvoice.amount.toLocaleString('en-IN')}</div>
                <div><strong className="font-medium">Due Date:</strong> {format(parseISO(selectedInvoice.dueDate), "PPP")}</div>
                <div><strong className="font-medium">Status:</strong> {getInvoiceStatusBadge(selectedInvoice.status)}</div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsViewInvoiceOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Receipt className="h-6 w-6 text-primary"/>Invoice Generator</CardTitle>
              <CardDescription>Create and send invoices to your clients.</CardDescription>
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
                          <Input type="number" placeholder="e.g., 125000.00" {...field} step="0.01" />
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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-6 w-6 text-primary"/>Finance Overview</CardTitle>
              <CardDescription>Key financial metrics at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-muted/30 shadow-md">
                   <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Total Revenue</span>
                       <span className="h-4 w-4 text-muted-foreground font-semibold">₹</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹1,25,67,000</div> {/* Placeholder */}
                    <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 shadow-md">
                   <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Pending Payments</span>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹12,34,500</div> {/* Placeholder */}
                    <p className="text-xs text-muted-foreground">5 invoices overdue</p>
                   </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Recent Invoices</h3>
                {invoices.length > 0 ? (
                  <div className="border rounded-md p-4 space-y-3 bg-muted/30 max-h-96 overflow-y-auto">
                    {invoices.map(inv => (
                      <div key={inv.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-background/50">
                        <div>
                          <p className="font-medium text-foreground">{inv.id} - {inv.clientName}</p>
                          <p className="text-muted-foreground">Amount: ₹{inv.amount.toLocaleString('en-IN')} | Due: {format(parseISO(inv.dueDate), "PP")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getInvoiceStatusBadge(inv.status)}
                            <Button variant="ghost" size="sm" onClick={() => openViewModal(inv)} className="p-1 h-auto">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No invoices found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
