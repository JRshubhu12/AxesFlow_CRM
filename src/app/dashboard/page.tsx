import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Briefcase, Mail, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back to AxesFlow</h1>
            <p className="text-lg text-blue-100 max-w-2xl mb-6">
              Your integrated solution for streamlining agency operations. Let's make today productive.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/profile" className="flex items-center">
                Setup Your Profile <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          {/* The illustration div and Image component were here */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600/50 z-0"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { title: 'New Leads', value: '24', change: '+12%', trend: 'up' },
            { title: 'Active Projects', value: '8', change: '+2', trend: 'up' },
            { title: 'Campaigns', value: '5', change: '-1', trend: 'down' },
            { title: 'Team Members', value: '14', change: '0%', trend: 'neutral' },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="text-sm font-medium text-gray-500">{stat.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`inline-flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                  {stat.trend === 'down' && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Add New Lead', href: '/leads/new', icon: Users },
                { title: 'Start Campaign', href: '/email-campaigns/new', icon: Mail },
                { title: 'Create Project', href: '/projects/new', icon: Briefcase },
              ].map((action, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="w-full justify-between py-6 px-4 hover:bg-gray-50 transition-colors"
                  asChild
                >
                  <Link href={action.href}>
                    <div className="flex items-center">
                      <action.icon className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{action.title}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <CardDescription>Latest updates across your agency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { 
                    title: 'New lead added', 
                    description: 'Sarah Johnson from TechCorp', 
                    time: '2 hours ago',
                    icon: Users
                  },
                  { 
                    title: 'Campaign sent', 
                    description: 'Q3 Product Update to 142 contacts', 
                    time: '5 hours ago',
                    icon: Mail
                  },
                  { 
                    title: 'Project milestone', 
                    description: 'Design phase completed for BrandX', 
                    time: '1 day ago',
                    icon: Briefcase
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-50 mr-4">
                      <activity.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 pl-0" asChild>
                <Link href="/activity">View all activity</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              title: 'Profile', 
              href: '/profile', 
              icon: User, 
              description: 'Manage agency details',
              bgColor: 'bg-indigo-50',
              iconColor: 'text-indigo-600'
            },
            { 
              title: 'Leads', 
              href: '/leads', 
              icon: Users, 
              description: 'View potential clients',
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600'
            },
            { 
              title: 'Projects', 
              href: '/projects', 
              icon: Briefcase, 
              description: 'Track project progress',
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600'
            },
            { 
              title: 'Campaigns', 
              href: '/email-campaigns', 
              icon: Mail, 
              description: 'Generate outreach emails',
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600'
            },
          ].map(item => (
            <Card key={item.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center ${item.bgColor} mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full" asChild>
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
