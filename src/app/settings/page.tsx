import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><SettingsIcon className="h-8 w-8 text-primary" /> Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences.</p>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>This is a placeholder for application settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Settings related to notifications, integrations, billing, and appearance would be configured here.</p>
            <ul className="list-disc list-inside mt-4 space-y-1 text-muted-foreground">
                <li>Notification Preferences</li>
                <li>Integration Management (e.g., Calendar, Email)</li>
                <li>Subscription & Billing</li>
                <li>Appearance (e.g., Theme toggle - Light/Dark)</li>
                <li>Data Export/Import</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
