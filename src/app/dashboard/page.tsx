import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Briefcase, Mail, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome to AxesFlow!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Your integrated solution for streamlining agency operations. Let&apos;s get you started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-4">
              <p>
                AxesFlow helps you manage leads, generate email campaigns, oversee projects, and collaborate with your team efficiently.
              </p>
              <p>
                To make the most of AxesFlow, start by setting up your agency profile.
              </p>
              <Button asChild size="lg" className="mt-2">
                <Link href="/profile">
                  Setup Your Profile <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-shrink-0">
              <Image 
                src="https://placehold.co/300x200.png" 
                alt="Workflow illustration" 
                width={300} 
                height={200} 
                className="rounded-lg shadow-md"
                data-ai-hint="workflow abstract" 
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Your Profile', href: '/profile', icon: User, description: 'Manage agency details.' },
            { title: 'Leads', href: '/leads', icon: Users, description: 'View potential clients.' },
            { title: 'Projects', href: '/projects', icon: Briefcase, description: 'Track project progress.' },
            { title: 'Email Campaigns', href: '/email-campaigns', icon: Mail, description: 'Generate outreach emails.' },
          ].map(item => (
            <Card key={item.title} className="hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                <item.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={item.href}>
                    Go to {item.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
