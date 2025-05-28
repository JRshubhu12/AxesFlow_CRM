import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Briefcase, Mail, Users, ChevronRight, MessageSquare, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-[length:40px_40px]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Welcome back to <span className="text-blue-400">AxesFlow</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mb-6 leading-relaxed">
                Your integrated solution for streamlined agency operations. 
                Monitor performance and accelerate growth with our unified platform.
              </p>
              <div className="flex gap-3">
                <Button variant="default" size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/profile" className="flex items-center gap-2">
                    Setup Profile <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-foreground border-gray-500 hover:bg-gray-800 hover:text-white">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block relative w-64 h-64">
              <div className="absolute -right-6 -top-6 w-full h-full bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-48 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-600/30 rounded-full flex items-center justify-center">
                    <Briefcase className="h-16 w-16 text-blue-400" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-6">
          {[
            { title: 'Leads', value: '24', change: '+12%', trend: 'up', icon: Users },
            { title: 'Campaigns', value: '5', change: '-1', trend: 'down', icon: Mail },
            { title: 'Talks', value: '18', change: '+3', trend: 'up', icon: MessageSquare },
            { title: 'Projects', value: '8', change: '+2', trend: 'up', icon: Briefcase },
            { title: 'Tasks', value: '32', change: '+5', trend: 'up', icon: CheckSquare },
            { title: 'Teams', value: '3', change: '0%', trend: 'neutral', icon: Users },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium text-gray-500">{stat.title}</CardDescription>
                  <stat.icon className="h-5 w-5 text-gray-400" />
                </div>
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
                { title: 'Add New Lead', href: '/leads', icon: Users },
                { title: 'Start Campaign', href: '/email-campaigns', icon: Mail },
                { title: 'Create Project', href: '/projects', icon: Briefcase },
                { title: 'Add Task', href: '/tasks', icon: CheckSquare },
                { title: 'Schedule Talk', href: '/talks', icon: MessageSquare },
                { title: 'Manage Team', href: '/teams', icon: Users },
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
                  { 
                    title: 'New talk scheduled', 
                    description: 'Meeting with Acme Inc. tomorrow', 
                    time: '1 day ago',
                    icon: MessageSquare
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: 'Leads', 
              href: '/leads', 
              icon: Users, 
              description: 'Manage potential clients',
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600'
            },
            { 
              title: 'Campaigns', 
              href: '/email-campaigns', 
              icon: Mail, 
              description: 'Email marketing campaigns',
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600'
            },
            { 
              title: 'Talks', 
              href: '/talks', 
              icon: MessageSquare, 
              description: 'Client meetings & calls',
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600'
            },
            { 
              title: 'Projects', 
              href: '/projects', 
              icon: Briefcase, 
              description: 'Track project progress',
              bgColor: 'bg-orange-50',
              iconColor: 'text-orange-600'
            },
            { 
              title: 'Tasks', 
              href: '/tasks', 
              icon: CheckSquare, 
              description: 'Manage team tasks',
              bgColor: 'bg-red-50',
              iconColor: 'text-red-600'
            },
            { 
              title: 'Teams', 
              href: '/teams', 
              icon: Users, 
              description: 'Team members & roles',
              bgColor: 'bg-indigo-50',
              iconColor: 'text-indigo-600'
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