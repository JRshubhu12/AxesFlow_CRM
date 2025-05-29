
// Icons are no longer used in navItems directly based on the new design reference.
// If specific icons are needed for other purposes, they can be imported as needed.

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
    href: '/leads', // Main link for "Leads" parent
    tooltip: 'Lead Management',
    // As per the image, "Find Leads" and "Manage Leads" are sub-items.
    // For now, they all point to the main /leads page which is being styled as "Manage Leads".
    // A dedicated "Find Leads" page/feature would be a separate development.
    subItems: [
      { title: 'Find Leads', href: '/leads', tooltip: 'Discover New Leads' },
      { title: 'Manage Leads', href: '/leads', tooltip: 'View Your Leads' },
    ]
  },
  { title: 'Campaigns', href: '/email-campaigns', tooltip: 'AI Email Generator' },
  { title: 'Talks', href: '/communications', tooltip: 'Meetings, Chats, Files' },
  { title: 'Projects', href: '/projects', tooltip: 'Manage Projects' },
  { title: 'Tasks', href: '/tasks', tooltip: 'Task Board' },
  { title: 'Teams', href: '/team', tooltip: 'Team Members' },
];
