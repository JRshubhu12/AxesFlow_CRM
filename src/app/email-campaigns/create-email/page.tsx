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
import { Sparkles, Copy, Download, Mail, Send, LayoutTemplate, BadgeCheck, Settings, Wand2, Search, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import sampleEmail from './sample_email.json';
import leadsData from '@/app/leads/sample.json';
import { TypeAnimation } from 'react-type-animation';

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';

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
type Lead = {
  id: string;
  name: string;
  email: string;
  status: string;
  company: string;
};

function getFirstName(fullName: string | undefined) {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
}

export default function EmailCampaignsPage() {
  const { toast } = useToast();
  const [generatedCampaignText, setGeneratedCampaignText] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const iRef = useRef(0);

  // Modal state
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sendSubject, setSendSubject] = useState('');
  const [sendTime, setSendTime] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [leadsExpanded, setLeadsExpanded] = useState(true);

  const subjectInputRef = useRef<HTMLInputElement>(null);
  const sendTimeInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (sendDialogOpen) {
      setTimeout(() => {
        if (subjectInputRef.current) subjectInputRef.current.blur();
        if (sendTimeInputRef.current) sendTimeInputRef.current.blur();
      }, 0);
    }
  }, [sendDialogOpen]);

  // Filter leads based on search term
  const filteredLeads = leadsData.filter((lead: Lead) => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      }, 4); // Faster animation: was 12ms, now 4ms
      return () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      };
    } else {
      setDisplayedText(generatedCampaignText || '');
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    }
  }, [generatedCampaignText, isLoading, activeTab]);

  // Generates a sample email with a placeholder for the first name
  function generateSampleEmailForName(firstName: string) {
    const greeting = `Dear ${firstName},`;
    return [
      sampleEmail.subject,
      '',
      greeting,
      '',
      sampleEmail.body,
      '',
      sampleEmail.signature,
    ].join('\n');
  }

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

    // Use first name of the first lead as preview
    const previewFirstName = leadsData.length > 0 ? getFirstName(leadsData[0].name) : "there";
    const emailText = generateSampleEmailForName(previewFirstName);

    setGeneratedCampaignText(emailText);
    setProgress(100);
    clearInterval(interval);

    toast({
      title: "Campaign Generated",
      description: "Your email campaign is ready for review.",
      variant: "default",
    });

    setTimeout(() => setIsLoading(false), 500);

    // Modal state defaults
    setSendSubject(sampleEmail.subject);
    setSelectedLeads([]); // Do not pre-select any leads
    setSendTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

    // Send preview to the first lead for demonstration (could be changed)
    try {
      const response = await fetch("/api/send-campaign-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Or your verified sender in production
          to: leadsData.length > 0 ? leadsData[0].email : "",
          subject: sampleEmail.subject,
          text: emailText,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Email Failed",
          description: data.error || data.message || JSON.stringify(data),
          variant: "destructive",
        });
        // eslint-disable-next-line no-console
        console.error("Email send error:", data, response.status, response.statusText);
      } else {
        toast({
          title: "Test Email Sent",
          description: `Campaign was sent to ${leadsData.length > 0 ? leadsData[0].email : ""}.`,
          variant: "default",
        });
      }
    } catch (e: any) {
      toast({
        title: "Email Failed",
        description: e?.message || String(e) || "Failed to send test email.",
        variant: "destructive",
      });
      // eslint-disable-next-line no-console
      console.error("Email send exception:", e);
    }
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
      const file = new Blob([generatedCampaignText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `campaign_${form.getValues('campaignName') || 'draft'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleSendToLeads = () => {
    if (generatedCampaignText) {
      setSendDialogOpen(true);
    } else {
      toast({
        title: "Cannot Send",
        description: "Please generate a campaign first.",
        variant: "destructive",
      });
    }
  };

  // Send campaign to all selected leads, personalized with their first name
  const doSendEmail = async () => {
    setIsSending(true);

    const leadsToSend = leadsData.filter((lead: Lead) => selectedLeads.includes(lead.email));
    let successCount = 0;
    let lastError: any = null;
    for (const lead of leadsToSend) {
      const personalizedEmailText = generateSampleEmailForName(getFirstName(lead.name));
      try {
        const response = await fetch("/api/send-campaign-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev", // Or your verified sender
            to: lead.email,
            subject: sendSubject,
            text: personalizedEmailText,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          lastError = data;
        } else {
          successCount++;
        }
      } catch (e) {
        lastError = e;
      }
    }
    setIsSending(false);
    setSendDialogOpen(false);

    if (successCount === 0 && lastError) {
      let msg = lastError.message || lastError.error || JSON.stringify(lastError) || "Failed to send campaign to leads.";
      toast({
        title: "Campaign Send Failed",
        description: msg,
        variant: "destructive",
      });
      // eslint-disable-next-line no-console
      console.error("Bulk email send error:", lastError);
    } else {
      toast({
        title: "Campaign Sent",
        description: `Campaign was sent to ${successCount} lead${successCount === 1 ? '' : 's'}.`,
        variant: "default",
      });
    }
  };

  const handleLeadCheckbox = (leadEmail: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadEmail)
        ? prev.filter((email) => email !== leadEmail)
        : [...prev, leadEmail] // Allow multiple selections
    );
  };

  const toggleSelectAllLeads = () => {
    if (selectedLeads.length === leadsData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadsData.map((lead: Lead) => lead.email));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'prospect': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    }
  };

  return (
    <>
      <MainLayout>
        <div className={isLoading ? 'pointer-events-none opacity-50 select-none' : ''}>
          <div className="space-y-8">
            {/* Header */}
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
              {/* Left: Form */}
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

              {/* Right: Output */}
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
                              <span key={`${line}-${idx}`}>
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
      {/* Enhanced Send Leads Modal */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="max-w-3xl bg-white dark:bg-gray-900 rounded-xl">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                <Send className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Send Campaign to Leads
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Select recipients and schedule your campaign delivery
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-5 space-y-6">
            {/* Campaign Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{form.watch('campaignName') || 'Untitled Campaign'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sendSubject}</p>
                </div>
                <Badge variant="secondary" className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {selectedLeads.length} {selectedLeads.length === 1 ? 'Lead' : 'Leads'} Selected
                </Badge>
              </div>
            </div>
            
            {/* Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Send Time</label>
                <Input
                  type="datetime-local"
                  value={sendTime}
                  onChange={e => setSendTime(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg"
                  ref={sendTimeInputRef}
                  tabIndex={-1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject Line</label>
                <Input
                  ref={subjectInputRef}
                  value={sendSubject}
                  onChange={e => setSendSubject(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg"
                  tabIndex={-1}
                />
              </div>
            </div>
            
            {/* Leads Section */}
            <div className="border rounded-xl overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
                onClick={() => setLeadsExpanded(!leadsExpanded)}
              >
                <h3 className="font-medium text-gray-900 dark:text-white">Select Leads</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {selectedLeads.length} selected
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectAllLeads();
                    }}
                    className="text-indigo-600 dark:text-indigo-400"
                  >
                    {selectedLeads.length === leadsData.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {leadsExpanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
              </div>
              
              {leadsExpanded && (
                <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search leads by name, email or company..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {filteredLeads.map((lead: Lead) => (
                      <div
                        key={lead.email}
                        className={`flex items-center gap-4 p-3 rounded-lg border ${
                          selectedLeads.includes(lead.email)
                            ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        } transition-colors`}
                      >
                        <div className="flex-shrink-0">
                          <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 h-10 w-10 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                            {lead.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate text-gray-900 dark:text-white">{lead.name}</p>
                            {lead.status && (
                              <Badge className={`px-2 py-0.5 text-xs ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{lead.email}</p>
                          {lead.company && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{lead.company}</p>
                          )}
                        </div>
                        <div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={selectedLeads.includes(lead.email)}
                              onChange={() => handleLeadCheckbox(lead.email)}
                            />
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              selectedLeads.includes(lead.email)
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'border border-gray-300 dark:border-gray-600'
                            }`}>
                              {selectedLeads.includes(lead.email) && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredLeads.length === 0 && (
                    <div className="text-center py-6">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                        <Search className="h-5 w-5 text-gray-500" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        No leads found matching "{searchTerm}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-lg">Cancel</Button>
            </DialogClose>
            <Button
              onClick={doSendEmail}
              disabled={isSending || selectedLeads.length === 0}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
            >
              {isSending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending to {selectedLeads.length} {selectedLeads.length === 1 ? 'lead' : 'leads'}...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to {selectedLeads.length} {selectedLeads.length === 1 ? 'Lead' : 'Leads'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}