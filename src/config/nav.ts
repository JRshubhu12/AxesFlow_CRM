
// Icons are no longer used in navItems directly based on the new design reference.
// If specific icons are needed for other purposes, they can be imported as needed.

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  tooltip?: string; // Tooltip might still be useful if sidebar collapses to icons only in future
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', tooltip: 'Overview' },
  { title: 'Leads', href: '/leads', tooltip: 'Potential Leads' },
  { title: 'Campaigns', href: '/email-campaigns', tooltip: 'AI Email Generator' },
  { title: 'Talks', href: '/communications', tooltip: 'Meetings, Chats, Files' },
  { title: 'Projects', href: '/projects', tooltip: 'Manage Projects' },
  { title: 'Tasks', href: '/tasks', tooltip: 'Task Board' },
  { title: 'Teams', href: '/team', tooltip: 'Team Members' },
];

// Settings nav item is removed from sidebar view based on the image.
// It might be accessed from user dropdown in a more complete design.
// export const settingsNavItem: NavItem = { title: 'Settings', href: '/settings', icon: Settings, tooltip: 'App Settings' };
