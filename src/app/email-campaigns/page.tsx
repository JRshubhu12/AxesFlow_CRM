
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { Sparkles, Copy, Download, AlertTriangle } from 'lucide-react';


// --- Form Validation Schema ---
const campaignSchema = z.object({
  targetIndustry: z.string().min(3, { message: "Target industry must be at least 3 characters." }),
  messageTemplates: z.string().min(10, { message: "Message templates must be at least 10 characters." }),
  campaignGoal: z.string().min(5, { message: "Campaign goal must be at least 5 characters." }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function EmailCampaignsPage() {
  const { toast } = useToast();
  const [generatedCampaignText, setGeneratedCampaignText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      targetIndustry: '',
      messageTemplates: '',
      campaignGoal: '',
    },
  });

  const onSubmit = async (data: CampaignFormValues) => {
    setIsLoading(true);
    setGeneratedCampaignText(null);

    // Simulate AI call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder campaign
    const placeholderText = `Subject: Supercharge Your ${data.targetIndustry} Business!

Hi [Name],

Are you looking to achieve ${data.campaignGoal}? Our solutions, based on key points like "${data.messageTemplates.substring(0, 30)}...", can help your ${data.targetIndustry} company thrive.

Let's connect!

Best,
AxesFlow Team

(This is a placeholder. AI generation is currently unavailable.)`;

    setGeneratedCampaignText(placeholderText);
    toast({
      title: "Campaign Draft Ready!",
      description: "A placeholder email campaign has been generated.",
      variant: "default",
    });
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (generatedCampaignText) {
      navigator.clipboard.writeText(generatedCampaignText);
      toast({ title: "Copied to clipboard!" });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="h-8 w-8 text-primary" /> Email Campaign Generator</h1>
            <p className="text-muted-foreground">Craft compelling email campaigns. (AI functionality is currently placeholder)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Provide the necessary inputs for your campaign.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="targetIndustry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SaaS, Real Estate, E-commerce" {...field} />
                        </FormControl>
                        <FormDescription>Specify the industry you're targeting.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="messageTemplates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Templates / Key Points</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Pain point: Wasting time on X. Solution: Our product Y helps save Z hours..." {...field} rows={5} />
                        </FormControl>
                        <FormDescription>Provide base templates or key messages.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="campaignGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Goal</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Book a demo, Increase sign-ups, Drive traffic" {...field} />
                        </FormControl>
                        <FormDescription>What is the primary objective of this campaign?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" /> Generate Campaign
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generated Campaign</CardTitle>
              <CardDescription>Review the generated email campaign below.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  <p className="mt-4 text-muted-foreground">Generating your campaign, please wait...</p>
                </div>
              )}
              {generatedCampaignText && !isLoading && (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none p-4 border rounded-md bg-muted/30 h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm">
                      {generatedCampaignText}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Text
                    </Button>
                    <Button variant="outline" disabled>
                      <Download className="mr-2 h-4 w-4" /> Download .txt
                    </Button>
                  </div>
                </div>
              )}
              {!generatedCampaignText && !isLoading && (
                <div className="text-center text-muted-foreground py-10">
                  Your generated campaign will appear here once you submit the form.
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>AI-powered generation is currently unavailable. Placeholders will be used.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
