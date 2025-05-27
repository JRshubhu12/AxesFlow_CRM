
"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, LinkIcon, CreditCard, Palette, Download, Upload } from 'lucide-react';

export default function SettingsPage() {
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
              <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-primary" />Integration Management</CardTitle>
              <CardDescription>Connect AxesFlow with other services you use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                <span className="font-medium">Google Calendar</span>
                <Button variant="outline" size="sm">Connect</Button>
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
