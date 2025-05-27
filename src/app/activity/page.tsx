
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';

export default function ActivityPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><ListChecks className="h-8 w-8 text-primary" /> Activity Log</h1>
        <p className="text-muted-foreground">Review all recent activities across your agency.</p>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>All Activities</CardTitle>
            <CardDescription>This is a placeholder for the comprehensive activity log.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>A detailed list of all user actions, system events, and notifications would be displayed here, with filtering and sorting options.</p>
            <ul className="list-disc list-inside mt-4 space-y-1 text-muted-foreground">
                <li>Timestamped entries</li>
                <li>User responsible for action</li>
                <li>Type of activity (e.g., Lead Created, Project Updated, Email Sent)</li>
                <li>Link to relevant item</li>
                <li>Filters for date range, user, activity type</li>
            </ul>
             <div className="mt-6 p-4 border border-dashed rounded-md text-center">
              <p className="text-muted-foreground">Full activity logging and display are under development.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
