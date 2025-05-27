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
import { Sparkles, Copy, Download } from 'lucide-react';

// --- API helper calling our own backend ---
async function generateEmailCampaignWithGemini(
  data: { targetIndustry: string; messageTemplates: string; campaignGoal: string }
): Promise<{ emailCampaign: string }> {
  const res = await fetch("/api/generate-campaign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to generate email campaign.");
  return result;
}

// --- Form Validation Schema ---
const campaignSchema = z.object({
  targetIndustry: z.string().min(3, { message: "Target industry must be at least 3 characters." }),
  messageTemplates: z.string().min(10, { message: "Message templates must be at least 10 characters." }),
  campaignGoal: z.string().min(5, { message: "Campaign goal must be at least 5 characters." }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function EmailCampaignsPage() {
  const { toast } = useToast();
  const [generatedCampaign, setGeneratedCampaign] = useState<{ emailCampaign: string } | null>(null);
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
    setGeneratedCampaign(null);
    try {
      const result = await generateEmailCampaignWithGemini(data);
      setGeneratedCampaign(result);
      toast({
        title: "Campaign Generated!",
        description: "Your AI-powered email campaign is ready.",
      });
    } catch (error: any) {
      console.error("Failed to generate email campaign:", error);
      toast({
        title: "Error",
        description: error.message ?? "Failed to generate email campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCampaign?.emailCampaign) {
      navigator.clipboard.writeText(generatedCampaign.emailCampaign);
      toast({ title: "Copied to clipboard!" });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="h-8 w-8 text-primary" /> AI Email Campaign Generator</h1>
            <p className="text-muted-foreground">Craft compelling email campaigns with the power of Gemini AI.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Provide the necessary inputs for the AI to generate your campaign.</CardDescription>
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
              <CardDescription>Review the AI-generated email campaign below.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  <p className="mt-4 text-muted-foreground">Generating your campaign, please wait...</p>
                </div>
              )}
              {generatedCampaign && !isLoading && (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none p-4 border rounded-md bg-muted/30 h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm">
                      {generatedCampaign.emailCampaign}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Text
                    </Button>
                    {/* Placeholder for download functionality */}
                    <Button variant="outline" disabled>
                      <Download className="mr-2 h-4 w-4" /> Download .txt
                    </Button>
                  </div>
                </div>
              )}
              {!generatedCampaign && !isLoading && (
                <div className="text-center text-muted-foreground py-10">
                  Your generated campaign will appear here once you submit the form.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}