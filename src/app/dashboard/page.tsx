"use client";

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { MoreVertical, Search, Users, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

// --- DATA ---
const kpiData = [
  {
    title: 'Total Leads',
    value: '2,371',
    trend: '+8%',
    trendDescription: 'To the last month',
    icon: <Users className="w-7 h-7 text-white" />,
    iconBg: '#7c5cff',
    trendIcon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 16 16"><path d="M3 9l3-3 3 3 3-3" stroke="#7c5cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="7.25" stroke="#7c5cff" strokeWidth="1.5"/></svg>
    ),
  },
  {
    title: 'Total Projects',
    value: '237',
    trend: '+11%',
    trendDescription: 'To the last month',
    icon: <Briefcase className="w-7 h-7 text-white" />,
    iconBg: '#7c5cff',
    trendIcon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 16 16"><path d="M3 9l3-3 3 3 3-3" stroke="#7c5cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="7.25" stroke="#7c5cff" strokeWidth="1.5"/></svg>
    ),
  },
];

const revenueData = [
  { name: 1, value: 5 },
  { name: 2, value: 7 },
  { name: 3, value: 6 },
  { name: 4, value: 8 },
  { name: 5, value: 10 },
  { name: 6, value: 9 },
  { name: 7, value: 13 },
  { name: 8, value: 21 },
];

const myTasksData = [
  {
    id: 'task1',
    title: 'Create Email Campaign',
    description: 'Create email campaigns for leads and schedule it for first message and automate follow ups.',
    tags: ['Web Design', 'Web Dev', 'Social Media'],
  },
  {
    id: 'task2',
    title: 'Create Email Campaign',
    description: 'Create email campaigns for leads and schedule it for first message and automate follow ups.',
    tags: ['Web Design', 'Web Dev', 'Social Media'],
  },
  {
    id: 'task3',
    title: 'Create Email Campaign',
    description: 'Create email campaigns for leads and schedule it for first message and automate follow ups.',
    tags: ['Web Design', 'Web Dev', 'Social Media'],
  },
];

const upcomingMeetingsData = [
  {
    id: 'meet1',
    date: '30 May 2025',
    time: '09:30 AM',
    meetingName: 'Project11C Final Meeting',
    joinees: [
      { name: 'Alex Anderson', avatar: 'https://placehold.co/32x32.png?text=AA' },
      { name: 'Blake Brown', avatar: 'https://placehold.co/32x32.png?text=BB' },
      { name: 'Casey Clark', avatar: 'https://placehold.co/32x32.png?text=CC' },
      { name: 'Dana Davis', avatar: 'https://placehold.co/32x32.png?text=DD' },
    ],
    host: 'Sashwat Sawarn',
    duration: '1h',
  },
  {
    id: 'meet2',
    date: '30 May 2025',
    time: '09:30 AM',
    meetingName: 'Project11C Final Meeting',
    joinees: [
      { name: 'Alex Anderson', avatar: 'https://placehold.co/32x32.png?text=AA' },
      { name: 'Blake Brown', avatar: 'https://placehold.co/32x32.png?text=BB' },
      { name: 'Casey Clark', avatar: 'https://placehold.co/32x32.png?text=CC' },
      { name: 'Dana Davis', avatar: 'https://placehold.co/32x32.png?text=DD' },
    ],
    host: 'Sashwat Sawarn',
    duration: '1h',
  },
];

// --- MAIN COMPONENT ---

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <MainLayout>
      <div className="w-full flex justify-center py-9 px-2 bg-[#fafbfc] min-h-screen">
        <div className="w-full max-w-6xl flex flex-col gap-8">
          {/* Top row: 2 KPI cards + My Tasks */}
          <div className="w-full flex flex-col md:flex-row gap-8">
            {/* KPI & Chart Section */}
            <div className="flex-1 flex flex-col gap-8">
              {/* KPIs Row */}
              <div className="flex w-full gap-8">
                <div className="flex flex-1 gap-8">
                  {kpiData.map((kpi) => (
                    <div
                      key={kpi.title}
                      className="flex-1 bg-white border border-[#e3e1f2] rounded-2xl flex flex-col shadow-none h-[118px] min-w-0"
                      style={{
                        boxShadow: "0 0 0 2px #f2f2fa",
                        minWidth: 0,
                      }}
                    >
                      {/* Top */}
                      <div className="flex items-center justify-between px-6 pt-5 pb-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 flex items-center justify-center rounded-full"
                            style={{ background: kpi.iconBg }}
                          >
                            {kpi.icon}
                          </div>
                          <span className="font-medium text-[18px] text-[#222]">{kpi.title}</span>
                        </div>
                        <button className="p-1 mt-[-4px]">
                          <MoreVertical className="h-5 w-5 text-[#888]" />
                        </button>
                      </div>
                      {/* Bottom */}
                      <div className="flex flex-row items-center justify-between px-6 py-2 bg-[#faf9ff] rounded-b-2xl border-t border-[#eceaf6]">
                        <span className="font-bold text-[28px] text-[#222]">{kpi.value}</span>
                        <span className="flex items-center gap-1 font-medium text-[15px] text-[#888]">
                          <span className="flex items-center gap-0.5">
                            {kpi.trendIcon}
                            <span className="text-[#7c5cff] font-semibold pl-1">{kpi.trend}</span>
                          </span>
                          <span className="ml-1">{kpi.trendDescription}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Monthly Revenue below KPIs */}
              <div className="w-full bg-white border border-[#E1E1F0] rounded-2xl p-6 flex flex-col justify-start items-start min-h-[340px]" style={{boxShadow: "0 0 0 2px #f2f2fa", border: "1.5px solid #e3e1f2"}}>
                <div className="font-semibold text-lg mb-2 text-[#313144]">Monthly Revenue</div>
                <div className="w-full" style={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid stroke="#F0F0F6" />
                      <XAxis dataKey="name" stroke="#A5A5BA" fontSize={14} tickLine={false} axisLine={false} />
                      <YAxis stroke="#A5A5BA" fontSize={14} tickLine={false} axisLine={false} domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #E1E1F0",
                          borderRadius: "8px",
                          fontSize: 14,
                          boxShadow: "none"
                        }}
                        wrapperStyle={{ boxShadow: 'none' }}
                      />
                      <Line
                        type="linear"
                        dataKey="value"
                        stroke="#7c5cff"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#fff", stroke: "#7c5cff", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#7c5cff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* My Tasks */}
            <div className="w-full md:w-[370px] flex-shrink-0">
              <div className="bg-white border border-[#E1E1F0] rounded-2xl flex flex-col min-w-[320px] max-w-[370px]" style={{boxShadow: "0 0 0 2px #f2f2fa", border: "1.5px solid #e3e1f2"}}>
                <div className="flex items-center justify-between border-b border-[#E1E1F0] px-6 py-4">
                  <span className="font-semibold text-lg text-[#313144]">My Tasks</span>
                  <span className="rounded-lg bg-[#7c5cff] text-white text-sm font-semibold px-4 py-1">
                    {currentDate}
                  </span>
                </div>
                <div className="flex flex-col gap-4 px-4 py-4">
                  {myTasksData.map((task) => (
                    <div key={task.id} className="bg-[#f7f7fa] rounded-lg p-3 flex flex-col gap-2 border border-[#e7e7f7]">
                      <div className="font-semibold text-sm text-[#313144]">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.description}</div>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-[#ece9ff] text-[#7c5cff] rounded-full px-2 py-0.5 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button className="bg-[#7c5cff] hover:bg-[#6c4de6] text-white mt-2 h-7 rounded-lg text-xs font-semibold shadow-none w-full">
                        View Task
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* UPCOMING MEETINGS SECTION */}
          <div className="w-full bg-white border border-[#E1E1F0] rounded-2xl px-5 pt-6 pb-3" style={{boxShadow: "0 0 0 2px #f2f2fa", border: "1.5px solid #e3e1f2"}}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
              <div className="font-semibold text-lg text-[#313144] mb-1 md:mb-0">
                Upcoming Meetings
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 h-9 text-sm rounded-lg border border-[#E1E1F0] bg-[#f7f7fa] focus:ring-0 outline-none"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-[#E1E1F0] text-[#7c5cff] font-semibold flex items-center gap-2 px-3"
                >
                  <svg className="h-4 w-4" fill="none" stroke="#7c5cff" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                  Filters
                </Button>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[650px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-[#313144] text-sm font-semibold">Date</th>
                    <th className="text-left py-2 px-3 text-[#313144] text-sm font-semibold">Meeting Name</th>
                    <th className="text-left py-2 px-3 text-[#313144] text-sm font-semibold">Joinees</th>
                    <th className="text-left py-2 px-3 text-[#313144] text-sm font-semibold">Host</th>
                    <th className="text-left py-2 px-3 text-[#313144] text-sm font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMeetingsData.map((meeting) => (
                    <tr key={meeting.id} className="border-t border-[#E1E1F0] hover:bg-[#f7f7fa]">
                      <td className="py-2 px-3 font-semibold text-[#313144] text-sm">{meeting.date}</td>
                      <td className="py-2 px-3 font-medium text-[#313144] text-sm">{meeting.meetingName}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center -space-x-2">
                          {meeting.joinees.slice(0, 3).map((joinee, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-white shadow">
                              <img src={joinee.avatar} alt={joinee.name} className="rounded-full" />
                            </Avatar>
                          ))}
                          {meeting.joinees.length > 3 && (
                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[#ece9ff] text-[#7c5cff] text-xs font-bold border-2 border-white shadow">
                              +{meeting.joinees.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#313144] text-sm">{meeting.host}</td>
                      <td className="py-2 px-3">
                        <Button className="bg-[#7c5cff] hover:bg-[#6c4de6] text-white rounded-lg h-8 px-5 text-sm font-semibold shadow-none">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}