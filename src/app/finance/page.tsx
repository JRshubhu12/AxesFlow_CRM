
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Ensure Label is imported
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { DollarSign, CalendarIcon, TrendingUp, AlertCircle, Receipt } from 'lucide-react';

const invoiceSchema = z.object({
  clientName: z.string().min(2, { message: "Client name must be at least 2 characters." }),
  projectName: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  dueDate: z.date({ required_error: "Due date is required." }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function FinancePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      projectName: '',
      amount: undefined, // Initialize as undefined for placeholder
      dueDate: undefined,
    },
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsLoading(true);
    console.log('Invoice data:', data);
    // Simulate API call for invoice generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Invoice Generated (Simulated)",
      description: `Invoice for ${data.clientName} - ${data.projectName} created.`,
    });
    form.reset(); // Reset form after submission
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><DollarSign className="h-8 w-8 text-primary" /> Finance Hub</h1>
            <p className="text-muted-foreground">Manage invoices and track financial performance.</p>
          </div>
        </div>

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
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1500.00" {...field} step="0.01" />
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
                <Card className="p-4 bg-muted/30">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold">$125,670.00</div>
                    <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                  </CardContent>
                </Card>
                <Card className="p-4 bg-muted/30">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold">$12,345.00</div>
                    <p className="text-xs text-muted-foreground">5 invoices overdue</p>
                   </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Recent Invoices (Placeholder)</h3>
                <div className="border rounded-md p-4 space-y-3 bg-muted/30">
                  {[
                    {id: 'INV-001', client: 'Alpha Solutions', amount: '$2,500.00', status: 'Paid'},
                    {id: 'INV-002', client: 'Beta Innovations', amount: '$1,200.00', status: 'Pending'},
                    {id: 'INV-003', client: 'Gamma Services', amount: '$3,000.00', status: 'Overdue'},
                  ].map(inv => (
                    <div key={inv.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">{inv.id} - {inv.client}</p>
                        <p className="text-muted-foreground">Amount: {inv.amount}</p>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs", 
                        inv.status === 'Paid' && 'bg-green-100 text-green-700',
                        inv.status === 'Pending' && 'bg-yellow-100 text-yellow-700',
                        inv.status === 'Overdue' && 'bg-red-100 text-red-700'
                      )}>{inv.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

