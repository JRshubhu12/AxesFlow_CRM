
import type { LucideIcon } from 'lucide-react';
// Icons are no longer used in navItems directly based on the new design reference.
// If specific icons are needed for other purposes, they can be imported as needed.
// import { LayoutDashboard, User, Users, Mail, MessageSquare, Briefcase, Users2, GanttChartSquare, Settings, DollarSign } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  // icon: LucideIcon; // Icons removed based on new design
  disabled?: boolean;
  tooltip?: string; // Tooltip might still be useful if sidebar collapses to icons only in future
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', tooltip: 'Overview' },
  { title: 'Leads', href: '/leads', tooltip: 'Potential Leads' },
  { title: 'Campaigns', href: '/email-campaigns', tooltip: 'AI Email Generator' }, // Was Email Campaigns
  { title: 'Talks', href: '/communications', tooltip: 'Meetings, Chats, Files' }, // Was Communications
  { title: 'Projects', href: '/projects', tooltip: 'Manage Projects' },
  { title: 'Tasks', href: '/tasks', tooltip: 'Task Board' },
  { title: 'Teams', href: '/team', tooltip: 'Team Members' }, // Was Team
];

// Settings nav item is removed from sidebar view based on the image.
// It might be accessed from user dropdown in a more complete design.
// export const settingsNavItem: NavItem = { title: 'Settings', href: '/settings', icon: Settings, tooltip: 'App Settings' };

