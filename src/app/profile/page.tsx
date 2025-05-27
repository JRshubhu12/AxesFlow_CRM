"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const profileSchema = z.object({
  agencyName: z.string().min(2, { message: "Agency name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  agencyDetails: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      agencyName: '',
      contactEmail: '',
      phone: '',
      address: '',
      agencyDetails: '',
    },
  });

  // In a real app, this would be a server action
  const onSubmit = async (data: ProfileFormValues) => {
    console.log('Profile data submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Profile Updated",
      description: "Your agency details have been saved.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Agency Profile</CardTitle>
            <CardDescription>
              Set up your agency details to personalize your AxesFlow experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" />Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Awesome Agency LLC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@agency.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Your Agency (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us a bit about your agency's focus and services." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
