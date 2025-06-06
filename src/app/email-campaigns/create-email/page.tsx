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
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Copy, Download, ChevronRight, Mail, Send, LayoutTemplate, ArrowRight, BadgeCheck, Settings, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import sampleEmail from './sample_email.json';
import { TypeAnimation } from 'react-type-animation';
    
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
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const iRef = useRef(0);

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

  // Typing animation effect
  useEffect(() => {
    if (generatedCampaignText && !isLoading && activeTab === 'plaintext') {
      setDisplayedText('');
      iRef.current = 0;
      const chars = Array.from(generatedCampaignText);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        setDisplayedText((prev) => {
          if (iRef.current >= chars.length) {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            return prev;
          }
          const next = prev + chars[iRef.current];
          iRef.current++;
          return next;
        });
      }, 12);
      return () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      };
    } else {
      setDisplayedText(generatedCampaignText || '');
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    }
  }, [generatedCampaignText, isLoading, activeTab]);

  const onSubmit = async (data: CampaignFormValues) => {
    setIsLoading(true);
    setGeneratedCampaignText(null);
    setProgress(0);
    setActiveTab('plaintext');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const emailText = [
      sampleEmail.subject,
      '',
      sampleEmail.greeting,
      '',
      sampleEmail.body,
      '',
      sampleEmail.signature
    ].join('\n');
    setGeneratedCampaignText(emailText);
    setProgress(100);
    clearInterval(interval);

    toast({
      title: "Campaign Generated",
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
        description: `Email campaign '${form.getValues('campaignName') || 'Untitled Campaign'}' has been sent to selected leads.`,
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
    <>
      <MainLayout>
        <div className={isLoading ? 'pointer-events-none opacity-50 select-none' : ''}>
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Campaign Generator</h1>
                    <p className="text-muted-foreground max-w-2xl mt-1">
                      Craft high-converting email campaigns with AI assistance
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <BadgeCheck className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">AI-powered content generation</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Panel - Enhanced Form */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Settings className="h-5 w-5 text-indigo-600" />
                    <span>Campaign Configuration</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Define your campaign parameters for optimal results
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="campaignName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Campaign Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Q3 SaaS Outreach" 
                                  {...field} 
                                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500 dark:text-gray-400">
                                Helps with organization and tracking
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Email Tone</FormLabel>
                              <select
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        name="targetIndustry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Target Industry</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Healthcare, Fintech" 
                                {...field} 
                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="campaignGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <LayoutTemplate className="h-4 w-4 text-indigo-600" />
                              Campaign Goal
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Increase demo bookings by 30%" 
                                {...field} 
                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500 dark:text-gray-400">
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
                            <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Key Messages & Value Propositions</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={`Example:\n- Reduce operational costs by 40%\n- Increase customer retention\n- Streamline workflow processes`} 
                                {...field} 
                                rows={5} 
                                className="min-h-[120px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500 dark:text-gray-400">
                              List the main points you want to communicate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full py-6 text-lg font-medium shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Wand2 className="mr-2 h-5 w-5 animate-pulse text-white" /> 
                              <span className="text-white">Generating Campaign...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-5 w-5 text-white" /> 
                              <span className="text-white">Generate Campaign</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Right Panel - Enhanced Output */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        <span>Campaign Output</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Review and refine your generated content
                      </CardDescription>
                    </div>
                    {generatedCampaignText && (
                      <Badge variant="secondary" className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                        {form.watch('tone') || 'professional'} tone
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <Progress value={progress} className="w-[80%] h-2 bg-gray-200 dark:bg-gray-800" />
                      <div className="text-center space-y-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-600 rounded-full opacity-75 animate-ping"></div>
                          <Sparkles className="h-10 w-10 text-indigo-600 relative mx-auto" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          Crafting your perfect campaign...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Analyzing {form.watch('targetIndustry') || 'industry'} best practices
                        </p>
                      </div>
                    </div>
                  )}

                  {generatedCampaignText && !isLoading && (
                    <div className="space-y-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 h-10">
                          <TabsTrigger 
                            value="preview" 
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 h-8"
                          >
                            Preview
                          </TabsTrigger>
                          <TabsTrigger 
                            value="plaintext" 
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-700 h-8"
                          >
                            Plain Text
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview">
                          <div className="prose prose-sm dark:prose-invert max-w-none p-6 border rounded-lg bg-white dark:bg-gray-800 h-[360px] overflow-y-auto font-sans text-[15px]">
                            {generatedCampaignText?.split('\n').map((line, idx) => (
                              <span key={idx}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="plaintext">
                          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 font-mono text-sm h-[360px] overflow-y-auto whitespace-pre-wrap">
                            {generatedCampaignText && !isLoading ? (
                              <TypeAnimation
                                sequence={[generatedCampaignText, 1000]}
                                speed={99}
                                style={{ whiteSpace: 'pre-line', display: 'block' }}
                                repeat={0}
                                cursor={false}
                              />
                            ) : (
                              displayedText
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          onClick={copyToClipboard}
                          className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                          disabled={!generatedCampaignText}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={downloadAsTxt}
                          className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                          disabled={!generatedCampaignText}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        <Button 
                          variant="default"
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          onClick={handleSendToLeads}
                          disabled={!generatedCampaignText}
                        >
                          <Send className="mr-2 h-4 w-4 text-white" /> 
                          <span className="text-white">Send to Leads</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {!generatedCampaignText && !isLoading && (
                    <div className="text-center py-10">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-4">
                        <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                        No campaign generated yet
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Configure your campaign settings and click "Generate Campaign" to create your first draft.
                      </p>
                      <div className="p-4 bg-indigo-50/70 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 max-w-md mx-auto">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
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

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="border rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <LayoutTemplate className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Professional Templates</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI-powered templates optimized for engagement and conversion across industries.
                </p>
              </div>
              
              <div className="border rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Smart Optimization</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Our AI analyzes industry trends to optimize subject lines and content structure.
                </p>
              </div>
              
              <div className="border rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:purple-900/30 text-purple-600 dark:text-purple-400">
                    <Send className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">One-Click Deployment</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Integrate with your CRM or send directly to leads with a single click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}