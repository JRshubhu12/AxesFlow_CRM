
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, Link as LinkIconLucide, CreditCard, Palette, Download, Upload, AlertTriangle, Calendar } from 'lucide-react';
import { useState } from 'react';
// import Nylas from '@nylas/nylas-js'; // Temporarily commented out
import { useToast } from '@/hooks/use-toast';

// IMPORTANT: FOR PROTOTYPE ONLY. DO NOT USE API KEYS OR CLIENT IDS DIRECTLY IN PRODUCTION FRONTEND.
// These should be stored securely, typically in environment variables on a backend.
// An Access Token obtained via a secure OAuth flow should be used for client-side SDK initialization.
// const NYLAS_API_KEY_FROM_USER = "nyk_v0_Cre8RfGMJvamicDAP40SYfP3au0iVtgLuGuvuW6c91LnCWboJoxconYvxGlSaaMd"; // Temporarily commented out
// const NYLAS_CLIENT_ID_FROM_USER = "f26452cc-b7ef-46df-9dd8-d8468f16d6d6"; // Temporarily commented out

type NylasConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'disabled';


export default function SettingsPage() {
  const [nylasStatus, setNylasStatus] = useState<NylasConnectionStatus>('disabled'); // Default to disabled
  const [nylasError, setNylasError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleNylasConnect = async () => {
    // Functionality temporarily disabled
    toast({ title: "Nylas Integration Disabled", description: "Nylas calendar connection is temporarily disabled due to package installation issues.", variant: "destructive" });
    return;

    // setNylasStatus('connecting');
    // setNylasError(null);
    // try {
    //   // Simulate OAuth delay for prototype
    //   await new Promise(resolve => setTimeout(resolve, 1500));

    //   // Initialize Nylas SDK.
    //   // In a real app, you'd use an access token obtained via OAuth.
    //   // The API key provided is being used here for prototype demonstration.
    //   // const nylas = new Nylas({ // Temporarily commented out
    //   //   apiKey: NYLAS_API_KEY_FROM_USER,
    //   //   // serverUrl: Nylas.Region.US, // Optional: specify region if not US
    //   // });

    //   // For a prototype, we'll assume initialization means connection.
    //   // A real check would involve making a lightweight API call, e.g., nylas.calendars.getPrimary() or nylas.account.get()
    //   // For now, if the SDK initializes without throwing an error, we'll consider it "connected" for the prototype.
      
    //   // Example of a lightweight check (optional, can be commented out for simpler prototype):
    //   // try {
    //   //   const account = await nylas.account.get();
    //   //   console.log('Nylas account details:', account);
    //   //   setNylasStatus('connected');
    //   //   toast({ title: "Nylas Connected!", description: `Successfully connected to Nylas account: ${account.data?.emailAddress}` });
    //   // } catch (sdkError: any) {
    //   //   console.error('Nylas SDK verification error:', sdkError);
    //   //   setNylasStatus('error');
    //   //   setNylasError(sdkError.message || 'Failed to verify Nylas connection.');
    //   //   toast({ title: "Nylas Connection Error", description: sdkError.message || 'Failed to verify Nylas connection.', variant: "destructive" });
    //   // }

    //   // Simplified connection status for prototype without API call:
    //   setNylasStatus('connected');
    //   toast({ title: "Nylas Connected!", description: "Successfully initialized Nylas SDK for calendar." });


    // } catch (error: any) {
    //   console.error('Nylas connection error:', error);
    //   setNylasStatus('error');
    //   setNylasError(error.message || 'An unknown error occurred during Nylas connection.');
    //   toast({ title: "Nylas Connection Error", description: error.message || 'Failed to connect.', variant: "destructive" });
    // }
  };

  const getNylasButtonText = () => {
    if (nylasStatus === 'disabled') return 'Nylas Calendar (Disabled)';
    if (nylasStatus === 'connecting') return 'Connecting...';
    if (nylasStatus === 'connected') return 'Nylas Calendar Connected';
    if (nylasStatus === 'error') return 'Retry Connection';
    return 'Connect Nylas Calendar';
  };


  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><SettingsIcon className="h-8 w-8 text-primary" /> Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <Label htmlFor="in-app-notifications" className="font-medium">In-App Notifications</Label>
                <Switch id="in-app-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                <Switch id="push-notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Integration Management */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LinkIconLucide className="h-5 w-5 text-primary" />Integration Management</CardTitle>
              <CardDescription>Connect AxesFlow with other services you use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium">Nylas Calendar</span>
                </div>
                <Button 
                    variant={nylasStatus === 'connected' ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleNylasConnect} 
                    disabled={nylasStatus === 'connecting' || nylasStatus === 'connected' || nylasStatus === 'disabled'}
                    className={nylasStatus === 'connected' ? 'bg-green-500 hover:bg-green-600 text-white' : nylasStatus === 'disabled' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {getNylasButtonText()}
                </Button>
              </div>
              {nylasStatus === 'error' && (
                <div className="p-3 rounded-md border border-destructive bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Error: {nylasError || 'Connection failed.'}</span>
                </div>
              )}
               {nylasStatus === 'disabled' && (
                <div className="p-3 rounded-md border border-yellow-500 bg-yellow-500/10 text-yellow-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Nylas integration is temporarily disabled.</span>
                </div>
              )}
              <div className="p-2 rounded-md border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                    <strong>Prototype Note:</strong> Direct API key usage here is for demonstration only. 
                    In production, use a secure OAuth flow and manage tokens on a backend.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <span className="font-medium">Slack</span>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <span className="font-medium">Mailchimp</span>
                <Button variant="outline" size="sm" disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" />Subscription & Billing</CardTitle>
              <CardDescription>Manage your subscription plan and view billing history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md border bg-muted/30">
                <p className="text-sm">Your current plan: <span className="font-semibold text-primary">Pro Plan</span></p>
                <p className="text-sm text-muted-foreground">Next billing date: August 30, 2024</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="default" className="flex-1">Manage Subscription</Button>
                <Button variant="outline" className="flex-1">View Billing History</Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <Label htmlFor="theme-toggle" className="font-medium">Dark Mode</Label>
                <Switch id="theme-toggle" />
              </div>
              <p className="text-xs text-muted-foreground">Theme toggle is a visual placeholder. Actual theme switching functionality is not implemented in this prototype.</p>
            </CardContent>
          </Card>

          {/* Data Export/Import */}
          <Card className="shadow-lg md:col-span-2"> {/* Spans two columns on medium screens and up */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5 text-primary" />Data Management</CardTitle>
              <CardDescription>Export your data or import data from other sources.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <Download className="h-4 w-4" /> Export All Data
              </Button>
              <Button variant="outline" className="flex-1 flex items-center gap-2" disabled>
                <Upload className="h-4 w-4" /> Import Data (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

