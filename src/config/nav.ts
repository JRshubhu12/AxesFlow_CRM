import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, User, Users, Mail, MessageSquare, Briefcase, Users2, GanttChartSquare, Settings } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  tooltip?: string;
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tooltip: 'Overview' },
  { title: 'Profile', href: '/profile', icon: User, tooltip: 'Agency Profile' },
  { title: 'Leads', href: '/leads', icon: Users, tooltip: 'Potential Leads' },
  { title: 'Email Campaigns', href: '/email-campaigns', icon: Mail, tooltip: 'AI Email Generator' },
  { title: 'Communications', href: '/communications', icon: MessageSquare, tooltip: 'Meetings, Chats, Files' },
  { title: 'Projects', href: '/projects', icon: Briefcase, tooltip: 'Manage Projects' },
  { title: 'Team', href: '/team', icon: Users2, tooltip: 'Team Members' },
  { title: 'Tasks', href: '/tasks', icon: GanttChartSquare, tooltip: 'Task Board' },
];

export const settingsNavItem: NavItem = { title: 'Settings', href: '/settings', icon: Settings, tooltip: 'App Settings' };
