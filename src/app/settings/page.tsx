"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, CreditCard, Palette, Download, Upload, Calendar as CalendarIconLucide } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your application preferences and account settings</p>
        </div>

        <Separator className="my-6" />

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Account Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="in-app-notifications" className="font-medium">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get alerts within the application</p>
                  </div>
                  <Switch id="in-app-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable desktop notifications</p>
                  </div>
                  <Switch id="push-notifications" />
                </div>
              </CardContent>
            </Card>

            {/* Subscription & Billing */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Subscription & Billing</CardTitle>
                </div>
                <CardDescription>Manage your subscription plan and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-muted/50 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-lg font-semibold text-primary">Pro Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Next Billing</p>
                      <p className="text-sm">August 30, 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button variant="default" className="flex-1">Upgrade Plan</Button>
                  <Button variant="outline" className="flex-1">Payment Methods</Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
                </div>
                <CardDescription>Export or import your application data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 h-12 flex items-center gap-2">
                    <Download className="h-4 w-4" /> 
                    <span>Export All Data</span>
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 flex items-center gap-2" disabled>
                    <Upload className="h-4 w-4" /> 
                    <span>Import Data</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Data exports include all your information in JSON format. Import functionality coming soon.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Appearance */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
                </div>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="theme-toggle" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                  <Switch id="theme-toggle" />
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CalendarIconLucide className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
                </div>
                <CardDescription>View and manage your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg border shadow-sm"
                  />
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">Selected Date</p>
                  <p className="text-sm">
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Need Help?</CardTitle>
                <CardDescription>Contact our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full h-12">
                  Contact Support
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Our team typically responds within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}