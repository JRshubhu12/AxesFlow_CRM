
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
import { Sparkles, Copy, Download, AlertTriangle, ChevronRight, Bookmark, Target, Mail, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Form Validation Schema ---
const campaignSchema = z.object({
  targetIndustry: z.string().min(3, {
    message: "Target industry must be at least 3 characters."
  }),
  messageTemplates: z.string().min(10, {
    message: "Message templates must be at least 10 characters."
  }),
  campaignGoal: z.string().min(5, {
    message: "Campaign goal must be at least 5 characters."
  }),
  campaignName: z.string().optional(),
  tone: z.enum(["professional", "friendly", "persuasive", "urgent"]).default("professional"),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function EmailCampaignsPage() {
  const { toast } = useToast();
  const [generatedCampaignText, setGeneratedCampaignText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      targetIndustry: '',
      messageTemplates: '',
      campaignGoal: '',
      campaignName: '',
      tone: 'professional',
    },
  });

  const onSubmit = async (data: CampaignFormValues) => {
    setIsLoading(true);
    setGeneratedCampaignText(null);
    setProgress(0);

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate AI call delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate more realistic placeholder content based on inputs
    const campaignExamples = {
      professional: `Subject: Elevating ${data.targetIndustry} Operations Through Strategic Partnership

Dear [First Name],

In today's competitive ${data.targetIndustry} landscape, achieving ${data.campaignGoal} requires innovative solutions. Our team at AxesFlow has helped companies like yours overcome similar challenges through:

${data.messageTemplates.split('\n').filter(Boolean).slice(0, 3).map(point => `• ${point}`).join('\n')}

I'd welcome the opportunity to discuss how we might support your objectives. Would you be available for a brief call next week?

Best regards,
[Your Name]
[Your Position]
AxesFlow Solutions`,

      friendly: `Hey [First Name],

I noticed your work in ${data.targetIndustry} and thought you might find this interesting!

We've been helping businesses like yours ${data.campaignGoal} with solutions that:
${data.messageTemplates.split('\n').filter(Boolean).slice(0, 2).map(point => `- ${point}`).join('\n')}

No pressure at all, but if you'd like to chat about how this could work for you, I'd be happy to set up a quick call. Let me know what you think!

Cheers,
[Your Name]
[Your Company]`,

      persuasive: `Subject: Last Chance to Transform Your ${data.targetIndustry} Results!

Hi [First Name],

Time is running out to ${data.campaignGoal} - but we can help! 

Here's what our clients are saying:
"${data.messageTemplates.split('\n')[0] || 'Transformative results in record time'}"

Limited availability this month - book your consultation now before spots fill up!

[Your Name]
[Your Company]
[Call-to-Action Button]`,

      urgent: `Subject: Action Required: Critical ${data.targetIndustry} Update

[First Name],

Our records indicate your business may be missing key opportunities to ${data.campaignGoal}. 

Immediate action recommended:
✓ ${data.messageTemplates.split('\n')[0] || 'Address critical inefficiencies'}
✓ ${data.messageTemplates.split('\n')[1] || 'Implement proven solutions'}

Response required by [date]. Click here to secure your position.

Regards,
[Your Name]
[Your Title]`
    };

    const placeholderText = campaignExamples[data.tone] || campaignExamples.professional;

    setGeneratedCampaignText(placeholderText);
    setProgress(100);
    clearInterval(interval);
    
    toast({
      title: "Campaign Draft Generated",
      description: "Your email campaign is ready for review.",
      variant: "default",
    });
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const copyToClipboard = () => {
    if (generatedCampaignText) {
      navigator.clipboard.writeText(generatedCampaignText);
      toast({ 
        title: "Copied to clipboard!",
        description: "The campaign text is ready for pasting into your email client.",
      });
    }
  };

  const downloadAsTxt = () => {
    if (generatedCampaignText) {
      const element = document.createElement('a');
      const file = new Blob([generatedCampaignText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `campaign_${form.getValues('campaignName') || 'draft'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleSendToLeads = () => {
    if (generatedCampaignText) {
      toast({
        title: "Campaign Sent (Simulated)",
        description: `Email campaign '${form.getValues('campaignName') || 'Untitled Campaign'}' has been sent to sashwatsawarn@gmail.com (and other selected leads).`,
        variant: "default",
      });
    } else {
      toast({
        title: "Cannot Send",
        description: "Please generate a campaign first.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Email Campaign Generator</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Craft high-converting email campaigns with AI assistance. Perfect for outreach, lead generation, and customer engagement.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Campaign Configuration
              </CardTitle>
              <CardDescription>
                Define your campaign parameters for optimal results
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Q3 SaaS Outreach" 
                            {...field} 
                            className="bg-muted/50"
                          />
                        </FormControl>
                        <FormDescription>
                          Helps with organization and tracking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetIndustry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Industry</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Healthcare, Fintech" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Tone</FormLabel>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="persuasive">Persuasive</option>
                            <option value="urgent">Urgent</option>
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="campaignGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Bookmark className="h-4 w-4" />
                          Campaign Goal
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Increase demo bookings by 30%" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about your desired outcome
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="messageTemplates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Messages & Value Propositions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={`Example:\n- Reduce operational costs by 40%\n- Increase customer retention\n- Streamline workflow processes`} 
                            {...field} 
                            rows={5} 
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormDescription>
                          List the main points you want to communicate
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-medium shadow-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 animate-pulse" /> 
                          Generating Campaign...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" /> 
                          Generate Campaign
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Campaign Output
                  </CardTitle>
                  <CardDescription>
                    Review and refine your generated content
                  </CardDescription>
                </div>
                {generatedCampaignText && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {form.watch('tone') || 'professional'} tone
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Progress value={progress} className="w-[80%] h-2" />
                  <div className="text-center space-y-2">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse mx-auto" />
                    <p className="text-muted-foreground font-medium">
                      Crafting your perfect campaign...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Analyzing {form.watch('targetIndustry') || 'industry'} best practices
                    </p>
                  </div>
                </div>
              )}

              {generatedCampaignText && !isLoading && (
                <div className="space-y-6">
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="plaintext">Plain Text</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview">
                      <div className="prose prose-sm dark:prose-invert max-w-none p-6 border rounded-lg bg-muted/5 h-[360px] overflow-y-auto">
                        {generatedCampaignText.split('\n').map((line, i) => (
                          <p key={i} className={line.startsWith('Subject:') ? 'font-semibold text-primary' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="plaintext">
                      <div className="p-4 border rounded-lg bg-muted/5 font-mono text-sm h-[360px] overflow-y-auto whitespace-pre-wrap">
                        {generatedCampaignText}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={copyToClipboard}
                      className="flex-1"
                      disabled={!generatedCampaignText}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={downloadAsTxt}
                      className="flex-1"
                      disabled={!generatedCampaignText}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button 
                      variant="default"
                      className="flex-1"
                      onClick={handleSendToLeads}
                      disabled={!generatedCampaignText}
                    >
                      <Send className="mr-2 h-4 w-4" /> Send to Leads
                    </Button>
                  </div>
                </div>
              )}

              {!generatedCampaignText && !isLoading && (
                <div className="text-center py-10">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-muted-foreground mb-1">
                    No campaign generated yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your campaign settings and click "Generate Campaign" to create your first draft.
                  </p>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-800 dark:text-blue-200 dark:bg-blue-900/30 dark:border-blue-800 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Pro Tip</p>
                        <p>
                          For best results, provide detailed information about your target audience and specific value propositions.
                        </p>
                      </div>
                    </div>
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
