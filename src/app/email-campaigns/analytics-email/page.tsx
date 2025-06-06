"use client";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart2,
  Mail,
  Users,
  CheckCircle,
  Clock,
  Send,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Label,
} from "recharts";

// --- Mock Data ---
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Promotion",
    type: "Regular email",
    lastEdited: new Date(2025, 5, 6, 1, 43),
    author: "Shubham Choudhary",
    status: "Draft",
    audience: "Premium Customers",
    analytics: { sent: 0, opened: 0, clicked: 0 },
  },
  {
    id: 2,
    name: "Product Launch Announcement",
    type: "Regular email",
    lastEdited: new Date(2025, 5, 6, 1, 38),
    author: "Shubham Choudhary",
    status: "Scheduled",
    audience: "All Subscribers",
    analytics: { sent: 0, opened: 0, clicked: 0 },
  },
  {
    id: 3,
    name: "Welcome Series #1",
    type: "Automated",
    lastEdited: new Date(2025, 5, 5, 14, 22),
    author: "Alex Johnson",
    status: "Sent",
    audience: "New Users",
    analytics: { sent: 1243, opened: 842, clicked: 321 },
  },
  {
    id: 4,
    name: "Re-engagement",
    type: "Automated",
    lastEdited: new Date(2025, 5, 4, 10, 0),
    author: "Alex Johnson",
    status: "Failed",
    audience: "Inactive Users",
    analytics: { sent: 0, opened: 0, clicked: 0 },
  },
];

// --- Helper Functions ---
function getStatusColor(status: string) {
  switch (status) {
    case "Draft":
      return "bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800";
    case "Scheduled":
      return "bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800";
    case "Sent":
      return "bg-gradient-to-r from-green-100 to-green-300 text-green-800";
    case "Failed":
      return "bg-gradient-to-r from-red-100 to-red-300 text-red-800";
    default:
      return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600";
  }
}
function getStatusIcon(status: string) {
  switch (status) {
    case "Draft":
      return <Clock className="h-5 w-5 text-gray-400" />;
    case "Scheduled":
      return <Send className="h-5 w-5 text-blue-500" />;
    case "Sent":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "Failed":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Mail className="h-5 w-5 text-gray-400" />;
  }
}

// --- Chart Data ---
const chartData = [
  {
    name: "Sent",
    value: mockCampaigns.filter((c) => c.status === "Sent").length,
  },
  {
    name: "Scheduled",
    value: mockCampaigns.filter((c) => c.status === "Scheduled").length,
  },
  {
    name: "Draft",
    value: mockCampaigns.filter((c) => c.status === "Draft").length,
  },
  {
    name: "Failed",
    value: mockCampaigns.filter((c) => c.status === "Failed").length,
  },
];

const pieColors = [
  "url(#sentGradient)",
  "url(#scheduledGradient)",
  "url(#draftGradient)",
  "url(#failedGradient)",
];

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) {
  const RADIAN = Math.PI / 180;
  // Position label just outside the pie
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#2d3748"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
      fontWeight="500"
      style={{ textShadow: "0 1px 2px #fff8" }}
    >
      {`${name} (${Math.round(percent * 100)}%)`}
    </text>
  );
}

// --- Main Component ---
export default function AnalyticsEmailPage() {
  const [tab, setTab] = useState("all");
  return (
    <MainLayout>
      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3 tracking-tight text-gray-900 dark:text-gray-100">
              <BarChart2 className="h-9 w-9 text-indigo-600" />
              Campaign Analytics
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Gain a professional overview of your email marketing campaigns. Analyze trends, filter by status, and discover actionable business insights from your outreach efforts.
            </p>
          </div>
        </div>
        {/* Charts & Recent Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Chart Card */}
          <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-50/90 to-white dark:from-gray-950 dark:to-gray-900 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-indigo-700">
                Status Distribution
              </CardTitle>
              <CardDescription className="mb-2 text-base">
                Campaigns grouped by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="sentGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                      <linearGradient id="scheduledGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                      <linearGradient id="draftGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a3e635" />
                        <stop offset="100%" stopColor="#84cc16" />
                      </linearGradient>
                      <linearGradient id="failedGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      stroke="#f3f4f6"
                      strokeWidth={2}
                    >
                      {chartData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={pieColors[i % pieColors.length]}
                          stroke="#fff"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.95)",
                        boxShadow: "0 2px 10px 0 #0001",
                        color: "#222",
                        fontWeight: 500,
                      }}
                    />
                    <RechartsLegend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      formatter={(value) => (
                        <span className="font-medium text-gray-700 dark:text-gray-200">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-7 px-1">
                {chartData.map((d, i) => (
                  <div key={d.name} className="flex flex-col items-center">
                    <span
                      className={`w-4 h-4 rounded-full inline-block mb-1`}
                      style={{
                        background: [
                          "linear-gradient(90deg,#6366f1,#818cf8)",
                          "linear-gradient(90deg,#38bdf8,#0ea5e9)",
                          "linear-gradient(90deg,#a3e635,#84cc16)",
                          "linear-gradient(90deg,#f87171,#ef4444)",
                        ][i],
                      }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {d.name}
                    </span>
                    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Recent Campaigns Card */}
          <Card className="bg-gradient-to-br from-white/90 to-gray-50 dark:from-gray-950 dark:to-gray-900 border-none shadow-2xl rounded-3xl col-span-2 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-700">
                Recent Campaigns
              </CardTitle>
              <CardDescription className="mb-2 text-base">
                The latest activity across your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {mockCampaigns.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-100/60 to-white dark:from-gray-900/70 dark:to-gray-800 border border-gray-100 dark:border-gray-800 shadow hover:shadow-md transition"
                  >
                    <div className="flex-shrink-0">{getStatusIcon(c.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-900 dark:text-white">
                          {c.name}
                        </span>
                        <Badge className={`ml-2 text-xs font-bold px-2 py-1 ${getStatusColor(c.status)}`}>
                          {c.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {c.type} &bull; {c.audience} &bull; By {c.author}
                      </div>
                    </div>
                    <div className="text-right min-w-fit">
                      <div className="text-xs text-muted-foreground">Last edited</div>
                      <div className="font-medium text-sm">
                        {format(c.lastEdited, "MMM dd, yyyy - h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Tabs Section */}
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="flex gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 shadow-inner">
            <TabsTrigger value="all" className="rounded-full px-4 py-1 font-semibold">All</TabsTrigger>
            <TabsTrigger value="sent" className="rounded-full px-4 py-1 font-semibold">Sent</TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-full px-4 py-1 font-semibold">Scheduled</TabsTrigger>
            <TabsTrigger value="draft" className="rounded-full px-4 py-1 font-semibold">Draft</TabsTrigger>
            <TabsTrigger value="failed" className="rounded-full px-4 py-1 font-semibold">Failed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockCampaigns.map((c) => (
                <Card
                  key={c.id}
                  className="p-0 border-none shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl"
                >
                  <CardHeader className="flex flex-row items-center gap-5 p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex-shrink-0">{getStatusIcon(c.status)}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {c.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {c.type} &bull; {c.audience} &bull; By {c.author}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 text-xs font-bold px-2 py-1 ${getStatusColor(c.status)}`}>
                      {c.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-12">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Sent</span>
                        <span className="font-bold text-lg">{c.analytics.sent}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Opened</span>
                        <span className="font-bold text-lg">{c.analytics.opened}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Clicked</span>
                        <span className="font-bold text-lg">{c.analytics.clicked}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                      Last edited {format(c.lastEdited, "MMM dd, yyyy - h:mm a")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {["Sent", "Scheduled", "Draft", "Failed"].map((status) => (
            <TabsContent value={status.toLowerCase()} key={status}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mockCampaigns.filter((c) => c.status === status).length === 0 ? (
                  <div className="text-center text-muted-foreground col-span-2 py-16 font-medium text-lg">
                    No {status} campaigns found.
                  </div>
                ) : (
                  mockCampaigns
                    .filter((c) => c.status === status)
                    .map((c) => (
                      <Card
                        key={c.id}
                        className="p-0 border-none shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl"
                      >
                        <CardHeader className="flex flex-row items-center gap-5 p-5 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex-shrink-0">{getStatusIcon(c.status)}</div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                              {c.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                              {c.type} &bull; {c.audience} &bull; By {c.author}
                            </CardDescription>
                          </div>
                          <Badge className={`ml-2 text-xs font-bold px-2 py-1 ${getStatusColor(c.status)}`}>
                            {c.status}
                          </Badge>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-12">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Sent</span>
                              <span className="font-bold text-lg">{c.analytics.sent}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Opened</span>
                              <span className="font-bold text-lg">{c.analytics.opened}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Clicked</span>
                              <span className="font-bold text-lg">{c.analytics.clicked}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-4">
                            Last edited {format(c.lastEdited, "MMM dd, yyyy - h:mm a")}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}