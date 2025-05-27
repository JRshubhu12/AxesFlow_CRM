
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Building, Mail, Phone, MapPin, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'userProfileData';

const profileSchema = z.object({
  agencyName: z.string().min(2, { message: "Agency name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  agencyDetails: z.string().optional(),
  agencyLogoUrl: z.string().optional().or(z.literal('')), // Will store Data URI
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      agencyName: '',
      contactEmail: '',
      phone: '',
      address: '',
      agencyDetails: '',
      agencyLogoUrl: '',
    },
  });

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData: ProfileFormValues = JSON.parse(storedData);
        form.reset(parsedData);
        if (parsedData.agencyLogoUrl) {
          setLogoPreview(parsedData.agencyLogoUrl);
        }
      } catch (error) {
        console.error("Failed to parse profile data from localStorage", error);
      }
    }
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log('Profile data submitted:', data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    toast({
      title: "Profile Updated",
      description: "Your agency details have been saved. Changes to your agency name or logo in the top bar may require a page refresh or navigation.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 2MB.",
        });
        setLogoPreview(form.getValues('agencyLogoUrl') || null); // Revert to old preview or null
        event.target.value = ""; // Clear the file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        fieldChange(dataUri); // Update RHF field value
        setLogoPreview(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      fieldChange(''); // Update RHF field value
      setLogoPreview(null);
    }
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
                  name="agencyLogoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />Agency Logo</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, field.onChange)}
                          // field.value is not used directly for file inputs for setting, but it's good for RHF to track it.
                          // field.ref is important for RHF to manage the input.
                        />
                      </FormControl>
                       <FormDescription>Upload your agency's logo (max 2MB). This will appear in the top navigation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {logoPreview && (
                  <div className="mt-4 space-y-1">
                    <Label>Logo Preview:</Label>
                    <img src={logoPreview} alt="Agency Logo Preview" className="mt-1 h-20 w-auto rounded-md border object-contain" data-ai-hint="logo preview"/>
                  </div>
                )}

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
