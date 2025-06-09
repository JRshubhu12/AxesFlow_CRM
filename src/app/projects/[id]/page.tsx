import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Users, Calendar, CheckCircle, BarChart, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // Mock data - in real app this would come from API
  const projectData = {
    title: "Website Redesign",
    description: "Complete redesign of company website with modern UI/UX principles",
    status: "In Progress",
    progress: 65,
    startDate: "2023-06-15",
    deadline: "2023-09-30",
    budget: "$24,500",
    team: [
      { name: "Alex Morgan", role: "Design Lead" },
      { name: "Jamie Smith", role: "Frontend Dev" },
      { name: "Taylor Kim", role: "Backend Dev" },
      { name: "Jordan Lee", role: "QA Specialist" }
    ],
    tasks: [
      { name: "Wireframe Design", status: "completed" },
      { name: "UI Mockups", status: "completed" },
      { name: "Frontend Development", status: "in-progress" },
      { name: "Backend Integration", status: "pending" },
      { name: "Testing & QA", status: "pending" }
    ],
    files: [
      { name: "Design_Specs.pdf", type: "pdf" },
      { name: "Wireframes.fig", type: "design" },
      { name: "Contract.docx", type: "document" }
    ]
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/projects" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">Edit Project</Button>
            <Button>Add Task</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-semibold flex items-center">
                      {projectData.title}
                      <span className="ml-3 text-xs font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {projectData.status}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {projectData.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {projectData.startDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {projectData.deadline}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{projectData.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <div className="flex items-center">
                      <Progress value={projectData.progress} className="h-2 w-full mr-2" />
                      <span className="text-sm font-medium">{projectData.progress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Card */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-3 ${
                          task.status === 'completed' ? 'bg-green-500' : 
                          task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        <span className="font-medium">{task.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground capitalize">
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Team Card */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.team.map((member, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Files Card */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-amber-500" />
                  Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-lg p-2 mr-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-sm">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Task Completion</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-semibold text-green-600">12</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-lg font-semibold text-yellow-600">5</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="text-lg font-semibold">8</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}