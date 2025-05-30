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
import { Building, Mail, Phone, MapPin, Image as ImageIcon, Upload, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const LOCAL_STORAGE_KEY = 'userProfileData';

const profileSchema = z.object({
  agencyName: z.string().min(2, { message: "Agency name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  agencyDetails: z.string().optional(),
  agencyLogoUrl: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      toast({
        title: "Profile Updated Successfully",
        description: "Your agency details have been saved.",
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error saving your profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) {
      fieldChange('');
      setLogoPreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please upload an image smaller than 2MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUri = reader.result as string;
      fieldChange(dataUri);
      setLogoPreview(dataUri);
    };
    reader.readAsDataURL(file);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agency Profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Customize your agency's presence on AxesFlow
            </p>
          </div>

          <Separator className="my-6" />

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-muted/5 border-b">
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Building className="mr-3 h-6 w-6" />
                Agency Information
              </CardTitle>
              <CardDescription>
                This information will be used across the platform to represent your agency.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="agencyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Agency Name
                              <Badge variant="required" className="ml-2">
                                Required
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your Agency Name" 
                                {...field} 
                                className="bg-background"
                              />
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
                            <FormLabel className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Contact Email
                              <Badge variant="required" className="ml-2">
                                Required
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="contact@agency.com" 
                                {...field} 
                                className="bg-background"
                              />
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
                            <FormLabel className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="(123) 456-7890" 
                                {...field} 
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Column - Logo Upload */}
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="agencyLogoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Agency Logo
                            </FormLabel>
                            <div className="flex items-center gap-4">
                              <label
                                htmlFor="logo-upload"
                                className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG up to 2MB
                                  </p>
                                </div>
                                <input
                                  id="logo-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, field.onChange)}
                                />
                              </label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {logoPreview && (
                        <div className="space-y-2">
                          <Label>Logo Preview</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img 
                                src={logoPreview} 
                                alt="Agency Logo Preview" 
                                className="h-20 w-20 rounded-md border object-contain shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  form.setValue('agencyLogoUrl', '');
                                  setLogoPreview(null);
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Your logo will appear in the navigation and client-facing areas.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Agency Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Main St, Anytown, ST 12345" 
                            {...field} 
                            className="bg-background"
                          />
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
                        <FormLabel>Agency Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your agency's mission, services, and specialties..."
                            {...field}
                            rows={5}
                            className="bg-background min-h-[120px]"
                          />
                        </FormControl>
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Info className="mr-2 h-4 w-4" />
                          This will be visible to clients in some areas of the platform.
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => form.reset()}
                      disabled={isSubmitting}
                    >
                      Reset Changes
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Profile'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}