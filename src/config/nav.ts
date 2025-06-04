export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  tooltip?: string; // Tooltip might still be useful if sidebar collapses to icons only in future
  subItems?: NavItem[]; // For nested navigation
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', tooltip: 'Overview' },
  {
    title: 'Leads',
    href: '/leads',
    tooltip: 'Lead Management',
  },
  { title: 'Campaigns', href: '/email-campaigns', tooltip: 'AI Email Generator' },
  { title: 'Talks', href: '/communications', tooltip: 'Meetings, Chats, Files' },
  { title: 'Projects', href: '/projects', tooltip: 'Manage Projects' },
  { title: 'Tasks', href: '/tasks', tooltip: 'Task Board' },
  { title: 'Teams', href: '/team', tooltip: 'Team Members' },
  { title: 'Finance', href: '/finance', tooltip: 'Finance Overview' },
];
