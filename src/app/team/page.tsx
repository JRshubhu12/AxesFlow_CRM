"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Users2,
  UserPlus,
  Star,
  X,
  MoreVertical,
  BarChart2,
  Check,
  GanttChart,
  Clipboard,
  MessageCircle,
  CalendarPlus,
  Activity,
  Mail,
  Phone,
  ChevronUp,
  ChevronDown,
  UserX,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Enhanced Team Member Schema
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  status: z.enum(["Active", "Inactive", "On Leave"]),
  phone: z.string().optional(),
  joinDate: z.string().optional(),
  department: z.string().optional(),
  performanceRating: z.number().min(1).max(5).optional(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export interface TeamMember extends TeamMemberFormValues {
  id: string;
  tasksAssigned: number;
  tasksCompleted: number;
  avatar: string;
  skills?: string[];
  lastActive?: string;
  bio?: string;
  isFavorite?: boolean;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  isFavorite?: boolean;
}

type TeamFormValues = {
  name: string;
  description?: string;
  memberIds: string[];
};

// Departments for organization
const departments = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "HR",
  "Operations",
  "Finance",
  "Customer Support",
];

// --- MOCK DATA FOR TEAMS AND MEMBERS ---
const mockTeamMembers: TeamMember[] = [
  {
    id: "T1",
    name: "Alice Johnson",
    role: "Frontend Engineer",
    email: "alice.johnson@example.com",
    status: "Active",
    phone: "+1 555-1111",
    joinDate: "2023-01-10",
    department: "Engineering",
    performanceRating: 5,
    tasksAssigned: 12,
    tasksCompleted: 11,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    skills: ["React", "TypeScript"],
    lastActive: "Today",
    bio: "UI specialist.",
    isFavorite: true,
  },
  {
    id: "T2",
    name: "Bob Smith",
    role: "Backend Engineer",
    email: "bob.smith@example.com",
    status: "Active",
    phone: "+1 555-2222",
    joinDate: "2022-11-15",
    department: "Engineering",
    performanceRating: 4,
    tasksAssigned: 10,
    tasksCompleted: 8,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    skills: ["Node.js", "PostgreSQL"],
    lastActive: "Yesterday",
    bio: "API and DB expert.",
    isFavorite: false,
  },
  {
    id: "T3",
    name: "Carol Lee",
    role: "Product Manager",
    email: "carol.lee@example.com",
    status: "On Leave",
    phone: "+1 555-3333",
    joinDate: "2021-09-01",
    department: "Product",
    performanceRating: 5,
    tasksAssigned: 7,
    tasksCompleted: 7,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    skills: ["Agile", "Scrum"],
    lastActive: "Last week",
    bio: "Drives product vision.",
    isFavorite: false,
  },
  {
    id: "T4",
    name: "David Kim",
    role: "Designer",
    email: "david.kim@example.com",
    status: "Active",
    phone: "+1 555-4444",
    joinDate: "2022-03-20",
    department: "Design",
    performanceRating: 4,
    tasksAssigned: 9,
    tasksCompleted: 8,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    skills: ["Figma", "UX"],
    lastActive: "Today",
    bio: "UX/UI designer.",
    isFavorite: false,
  },
  {
    id: "T5",
    name: "Eva Green",
    role: "QA Engineer",
    email: "eva.green@example.com",
    status: "Active",
    phone: "+1 555-5555",
    joinDate: "2023-02-14",
    department: "Engineering",
    performanceRating: 3,
    tasksAssigned: 6,
    tasksCompleted: 6,
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    skills: ["Testing", "Automation"],
    lastActive: "Today",
    bio: "Ensures quality.",
    isFavorite: false,
  },
  {
    id: "T6",
    name: "Frank Moore",
    role: "Sales Lead",
    email: "frank.moore@example.com",
    status: "Active",
    phone: "+1 555-6666",
    joinDate: "2021-12-01",
    department: "Sales",
    performanceRating: 5,
    tasksAssigned: 15,
    tasksCompleted: 14,
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    skills: ["CRM", "Negotiation"],
    lastActive: "Today",
    bio: "Top sales performer.",
    isFavorite: true,
  },
  {
    id: "T7",
    name: "Grace Lin",
    role: "Marketing Specialist",
    email: "grace.lin@example.com",
    status: "Active",
    phone: "+1 555-7777",
    joinDate: "2022-07-10",
    department: "Marketing",
    performanceRating: 4,
    tasksAssigned: 8,
    tasksCompleted: 7,
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    skills: ["SEO", "Content"],
    lastActive: "Yesterday",
    bio: "Drives campaigns.",
    isFavorite: false,
  },
  {
    id: "T8",
    name: "Henry Adams",
    role: "Support Agent",
    email: "henry.adams@example.com",
    status: "Inactive",
    phone: "+1 555-8888",
    joinDate: "2023-04-01",
    department: "Customer Support",
    performanceRating: 2,
    tasksAssigned: 5,
    tasksCompleted: 3,
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    skills: ["Zendesk", "Empathy"],
    lastActive: "Last month",
    bio: "Customer support.",
    isFavorite: false,
  },
  {
    id: "T9",
    name: "Ivy Chen",
    role: "HR Manager",
    email: "ivy.chen@example.com",
    status: "Active",
    phone: "+1 555-9999",
    joinDate: "2020-10-10",
    department: "HR",
    performanceRating: 5,
    tasksAssigned: 10,
    tasksCompleted: 10,
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    skills: ["Recruiting", "Onboarding"],
    lastActive: "Today",
    bio: "People operations.",
    isFavorite: true,
  },
  {
    id: "T10",
    name: "Jack Lee",
    role: "Finance Analyst",
    email: "jack.lee@example.com",
    status: "Active",
    phone: "+1 555-1010",
    joinDate: "2022-05-05",
    department: "Finance",
    performanceRating: 4,
    tasksAssigned: 7,
    tasksCompleted: 6,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    skills: ["Excel", "Forecasting"],
    lastActive: "Yesterday",
    bio: "Finance and analytics.",
    isFavorite: false,
  },
  // 10 more members for variety
  {
    id: "T11",
    name: "Kate Brown",
    role: "Designer",
    email: "kate.brown@example.com",
    status: "Active",
    phone: "+1 555-1112",
    joinDate: "2023-03-01",
    department: "Design",
    performanceRating: 3,
    tasksAssigned: 4,
    tasksCompleted: 4,
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    skills: ["Illustrator", "Branding"],
    lastActive: "Today",
    bio: "Brand designer.",
    isFavorite: false,
  },
  {
    id: "T12",
    name: "Leo White",
    role: "Engineer",
    email: "leo.white@example.com",
    status: "Inactive",
    phone: "+1 555-1212",
    joinDate: "2021-08-15",
    department: "Engineering",
    performanceRating: 2,
    tasksAssigned: 3,
    tasksCompleted: 2,
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    skills: ["Go", "Docker"],
    lastActive: "Last week",
    bio: "DevOps specialist.",
    isFavorite: false,
  },
  {
    id: "T13",
    name: "Mona Patel",
    role: "Product Owner",
    email: "mona.patel@example.com",
    status: "Active",
    phone: "+1 555-1313",
    joinDate: "2022-09-09",
    department: "Product",
    performanceRating: 4,
    tasksAssigned: 6,
    tasksCompleted: 6,
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    skills: ["Roadmap", "Stakeholder"],
    lastActive: "Today",
    bio: "Owns product backlog.",
    isFavorite: false,
  },
  {
    id: "T14",
    name: "Nate Black",
    role: "Sales Rep",
    email: "nate.black@example.com",
    status: "Active",
    phone: "+1 555-1414",
    joinDate: "2023-01-20",
    department: "Sales",
    performanceRating: 3,
    tasksAssigned: 5,
    tasksCompleted: 4,
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    skills: ["Pitching", "CRM"],
    lastActive: "Yesterday",
    bio: "Sales team.",
    isFavorite: false,
  },
  {
    id: "T15",
    name: "Olivia King",
    role: "Support Lead",
    email: "olivia.king@example.com",
    status: "On Leave",
    phone: "+1 555-1515",
    joinDate: "2021-06-30",
    department: "Customer Support",
    performanceRating: 4,
    tasksAssigned: 8,
    tasksCompleted: 7,
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    skills: ["Zendesk", "Training"],
    lastActive: "Last week",
    bio: "Leads support team.",
    isFavorite: false,
  },
  {
    id: "T16",
    name: "Paul Young",
    role: "HR Specialist",
    email: "paul.young@example.com",
    status: "Active",
    phone: "+1 555-1616",
    joinDate: "2022-02-02",
    department: "HR",
    performanceRating: 3,
    tasksAssigned: 4,
    tasksCompleted: 3,
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    skills: ["Payroll", "Benefits"],
    lastActive: "Today",
    bio: "HR operations.",
    isFavorite: false,
  },
  {
    id: "T17",
    name: "Quinn Fox",
    role: "Finance Manager",
    email: "quinn.fox@example.com",
    status: "Active",
    phone: "+1 555-1717",
    joinDate: "2020-12-12",
    department: "Finance",
    performanceRating: 5,
    tasksAssigned: 9,
    tasksCompleted: 9,
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    skills: ["Budgeting", "Reporting"],
    lastActive: "Yesterday",
    bio: "Finance lead.",
    isFavorite: true,
  },
  {
    id: "T18",
    name: "Rita Hall",
    role: "Marketing Lead",
    email: "rita.hall@example.com",
    status: "Active",
    phone: "+1 555-1818",
    joinDate: "2023-05-05",
    department: "Marketing",
    performanceRating: 4,
    tasksAssigned: 7,
    tasksCompleted: 6,
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    skills: ["Strategy", "Brand"],
    lastActive: "Today",
    bio: "Heads marketing.",
    isFavorite: false,
  },
  {
    id: "T19",
    name: "Sam Wu",
    role: "Engineer",
    email: "sam.wu@example.com",
    status: "Inactive",
    phone: "+1 555-1919",
    joinDate: "2021-04-04",
    department: "Engineering",
    performanceRating: 2,
    tasksAssigned: 2,
    tasksCompleted: 1,
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    skills: ["Python", "CI/CD"],
    lastActive: "Last month",
    bio: "Automation engineer.",
    isFavorite: false,
  },
  {
    id: "T20",
    name: "Tina Rose",
    role: "Product Designer",
    email: "tina.rose@example.com",
    status: "Active",
    phone: "+1 555-2020",
    joinDate: "2022-10-10",
    department: "Design",
    performanceRating: 4,
    tasksAssigned: 5,
    tasksCompleted: 5,
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    skills: ["Sketch", "Prototyping"],
    lastActive: "Today",
    bio: "UX prototyper.",
    isFavorite: false,
  },
];

const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Frontend Wizards",
    description: "Building beautiful UIs.",
    members: mockTeamMembers.filter((m) => ["T1", "T4", "T11", "T20"].includes(m.id)),
    isFavorite: true,
  },
  {
    id: "team-2",
    name: "Backend Gurus",
    description: "API and database experts.",
    members: mockTeamMembers.filter((m) => ["T2", "T5", "T12", "T19"].includes(m.id)),
    isFavorite: false,
  },
  {
    id: "team-3",
    name: "Product Masters",
    description: "Product strategy and management.",
    members: mockTeamMembers.filter((m) => ["T3", "T13", "T15"].includes(m.id)),
    isFavorite: false,
  },
  {
    id: "team-4",
    name: "Design Dreamers",
    description: "Creative design team.",
    members: mockTeamMembers.filter((m) => ["T4", "T11", "T20"].includes(m.id)),
    isFavorite: false,
  },
  {
    id: "team-5",
    name: "Sales Stars",
    description: "Top sales performers.",
    members: mockTeamMembers.filter((m) => ["T6", "T14"].includes(m.id)),
    isFavorite: true,
  },
  {
    id: "team-6",
    name: "Support Squad",
    description: "Customer support heroes.",
    members: mockTeamMembers.filter((m) => ["T8", "T15"].includes(m.id)),
    isFavorite: false,
  },
];
// --- END MOCK DATA ---

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>(() => mockTeams);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => mockTeamMembers);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isViewMemberOpen, setIsViewMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<"teams" | "members">("teams");
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const teamNameInputRef = useRef<HTMLInputElement>(null);
  const [assignTeamId, setAssignTeamId] = useState<string | null>(null);
  const [assignMemberIds, setAssignMemberIds] = useState<string[]>([]);

  // Team creation form
  const teamForm = useForm<TeamFormValues>({
    defaultValues: { name: "", description: "", memberIds: [] },
  });

  useEffect(() => {
    // Optionally, sync to localStorage if not present
    if (!localStorage.getItem("teams")) {
      localStorage.setItem("teams", JSON.stringify(mockTeams));
    }
    if (!localStorage.getItem("teamMembers")) {
      localStorage.setItem("teamMembers", JSON.stringify(mockTeamMembers));
    }
  }, []);

  useEffect(() => {
    if (isAddTeamOpen && teamNameInputRef.current) {
      // If the input is focused, blur it to prevent auto-focus
      if (document.activeElement === teamNameInputRef.current) {
        teamNameInputRef.current.blur();
      }
    }
  }, [isAddTeamOpen]);

  // Add Member
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      status: "Active",
      phone: "",
      joinDate: format(new Date(), "yyyy-MM-dd"),
      department: "",
      performanceRating: 3,
    },
  });

  const handleAddMemberSubmit = (values: TeamMemberFormValues) => {
    const newMember: TeamMember = {
      ...values,
      id: `T${Date.now()}`,
      tasksAssigned: 0,
      tasksCompleted: 0,
      avatar: `https://placehold.co/100x100.png?text=${values.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()}`,
      skills: [],
      lastActive: "Just now",
      bio: "New team member",
      isFavorite: false,
    };

    setTeamMembers((prev) => {
      const updated = [...prev, newMember];
      localStorage.setItem("teamMembers", JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Team Member Added",
      description: `${newMember.name} has been added.`,
      variant: "default",
    });
    form.reset();
    setIsAddMemberOpen(false);
  };

  // Add Team
  const handleAddTeamSubmit = (values: TeamFormValues) => {
    if (!values.name) {
      toast({ title: "Team Name required", variant: "destructive" });
      return;
    }
    const members = teamMembers.filter((tm) =>
      values.memberIds.includes(tm.id)
    );
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: values.name,
      description: values.description,
      members,
      isFavorite: false,
    };
    setTeams((prev) => {
      const updated = [...prev, newTeam];
      localStorage.setItem("teams", JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Team Created",
      description: `Team "${values.name}" created.`,
      variant: "default",
    });
    teamForm.reset();
    setIsAddTeamOpen(false);
  };

  // Delete Team
  const handleDeleteTeam = (teamId: string) => {
    setTeams((prev) => {
      const updated = prev.filter((team) => team.id !== teamId);
      localStorage.setItem("teams", JSON.stringify(updated));
      return updated;
    });
    // Reset the team creation form to avoid select defaultValue errors
    teamForm.reset({ name: "", description: "", memberIds: [] });
    // If the deleted team is currently selected in the dialog, close it
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam(null);
    }
    toast({ title: "Team deleted", variant: "default" });
  };

  const handleAssignTask = (memberName: string) => {
    toast({
      title: "Assign Task",
      description: `Navigating to task assignment for ${memberName}...`,
      variant: "default",
    });
  };

  const openViewModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsViewMemberOpen(true);
  };

  const handleStartChat = (member: TeamMember) => {
    toast({
      title: "Chat Initiated",
      description: `Chat with ${member.name} started. Redirecting...`,
      variant: "default",
    });
    router.push("/communications?tab=chats");
  };

  const handleScheduleMeeting = (member: TeamMember) => {
    toast({
      title: "Meeting Scheduled",
      description: `Meeting with ${member.name} scheduled. Redirecting...`,
      variant: "default",
    });
    router.push("/communications?tab=meetings");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      variant: "default",
    });
  };

  const toggleFavoriteMember = (memberId: string) => {
    setTeamMembers((prev) => {
      const updated = prev.map((member) =>
        member.id === memberId
          ? { ...member, isFavorite: !member.isFavorite }
          : member
      );
      localStorage.setItem("teamMembers", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavoriteTeam = (teamId: string) => {
    setTeams((prev) => {
      const updated = prev.map((team) =>
        team.id === teamId ? { ...team, isFavorite: !team.isFavorite } : team
      );
      localStorage.setItem("teams", JSON.stringify(updated));
      return updated;
    });
  };

  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter((m) => m.status === "Active").length;
  const totalTasks = teamMembers.reduce((sum, m) => sum + m.tasksAssigned, 0);
  const completionRate =
    totalTasks > 0
      ? Math.round(
          (teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0) /
            totalTasks) *
            100
        )
      : 0;

  // Helper to get teams for a member
  const getMemberTeams = (memberId: string) =>
    teams
      .filter((team) => team.members.some((m) => m.id === memberId))
      .map((t) => t.name);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;
      const matchesDepartment =
        departmentFilter === "All" || member.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [teamMembers, searchTerm, statusFilter, departmentFilter]);

  const sortedMembers = useMemo(() => {
    if (!sortConfig || !sortConfig.key) return filteredMembers;
    return [...filteredMembers].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof TeamMember];
      const bValue = b[sortConfig.key as keyof TeamMember];
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredMembers, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Filter teams
  const filteredTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teams, searchTerm]);

  // Stats for dashboard
  const departmentStats = useMemo(() => {
    const stats: Record<
      string,
      { count: number; active: number; tasks: number }
    > = {};
    teamMembers.forEach((member) => {
      if (!member.department) return;
      if (!stats[member.department]) {
        stats[member.department] = { count: 0, active: 0, tasks: 0 };
      }
      stats[member.department].count++;
      if (member.status === "Active") stats[member.department].active++;
      stats[member.department].tasks += member.tasksAssigned;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      count: data.count,
      active: data.active,
      tasks: data.tasks,
      percentage: Math.round((data.active / data.count) * 100),
    }));
  }, [teamMembers]);

  // Handler to open assign dialog
  const openAssignDialog = (teamId: string) => {
    setAssignTeamId(teamId);
    const team = teams.find((t) => t.id === teamId);
    setAssignMemberIds(team ? team.members.map((m) => m.id) : []);
  };

  // Handler to assign members
  const handleAssignMembers = () => {
    if (!assignTeamId) return;
    setTeams((prev) => {
      const updated = prev.map((team) =>
        team.id === assignTeamId
          ? {
              ...team,
              members: teamMembers.filter((m) => assignMemberIds.includes(m.id)),
            }
          : team
      );
      localStorage.setItem("teams", JSON.stringify(updated));
      // If the selectedTeam is the one being updated, update its members too
      if (selectedTeam && selectedTeam.id === assignTeamId) {
        const updatedTeam = updated.find((t) => t.id === assignTeamId);
        if (updatedTeam) setSelectedTeam(updatedTeam);
      }
      return updated;
    });
    setAssignTeamId(null);
  };

  // --- Custom multi-select for team assignment ---
  function MemberCheckboxList({
    value,
    onChange,
    allMembers,
  }: {
    value: string[];
    onChange: (val: string[]) => void;
    allMembers: TeamMember[];
  }) {
    return (
      <div className="max-h-64 overflow-y-auto flex flex-col gap-2 mt-2">
        {allMembers.map((member) => (
          <label
            key={member.id}
            className="flex items-center gap-3 px-2 py-1 rounded hover:bg-muted cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(member.id)}
              onChange={() => {
                if (value.includes(member.id)) {
                  onChange(value.filter((id) => id !== member.id));
                } else {
                  onChange([...value, member.id]);
                }
              }}
            />
            <Avatar className="h-6 w-6">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.role}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Users2 className="h-7 w-7 text-primary" />
              </div>
              <span>Team Management</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your team members, assign tasks, and coordinate
              collaboration
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 pl-5 pr-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                  <Users className="h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Create New Team
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Fill in the details and assign team members.
                  </DialogDescription>
                </DialogHeader>
                <Form {...teamForm}>
                  <form
                    onSubmit={teamForm.handleSubmit(handleAddTeamSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={teamForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Growth Team"
                              autoFocus={false}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe the team..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="memberIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign Members</FormLabel>
                          {/* Multi-select for team members in team creation */}
                          <MemberCheckboxList
                            value={field.value}
                            onChange={field.onChange}
                            allMembers={teamMembers}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        <Check className="h-4 w-4 mr-2" /> Create Team
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 pl-5 pr-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Add New Team Member
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Complete the form to add a new member to your workspace
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAddMemberSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Alex Johnson"
                                className="py-5 px-4 rounded-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Role</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Software Engineer"
                                className="py-5 px-4 rounded-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="e.g., alex.j@example.com"
                                className="py-5 px-4 rounded-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="e.g., +1 (555) 123-4567"
                                className="py-5 px-4 rounded-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="joinDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Join Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="py-5 px-4 rounded-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Department
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-5 px-4 rounded-lg">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-lg">
                                {departments.map((dept) => (
                                  <SelectItem value={dept} key={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-5 px-4 rounded-lg">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-lg">
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="On Leave">
                                  On Leave
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="performanceRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              Performance Rating
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="py-5 px-4 rounded-lg">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-lg">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem value={num.toString()} key={num}>
                                    {num} {num === 1 ? "star" : "stars"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        <Check className="h-4 w-4 mr-2" /> Add Member
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex gap-4 items-center py-5">
              <div className="bg-primary/10 rounded-lg p-3">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{totalMembers}</div>
                <div className="text-muted-foreground text-sm">
                  Total Members
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-4 items-center py-5">
              <div className="bg-green-100 rounded-lg p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{activeMembers}</div>
                <div className="text-muted-foreground text-sm">
                  Active Members
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-4 items-center py-5">
              <div className="bg-blue-100 rounded-lg p-3">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{totalTasks}</div>
                <div className="text-muted-foreground text-sm">Total Tasks</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-4 items-center py-5">
              <div className="bg-gray-100 rounded-lg p-3">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {teamMembers.filter((m) => m.status === "Inactive").length}
                </div>
                <div className="text-muted-foreground text-sm">
                  Inactive Members
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Statistics */}
        <div className="bg-muted/40 rounded-lg p-4">
          <div className="font-semibold mb-2">Departments Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departmentStats.map((dept) => (
              <div
                key={dept.name}
                className="p-3 bg-white rounded-lg shadow flex flex-col gap-1"
              >
                <div className="font-medium">{dept.name}</div>
                <div className="text-xs text-muted-foreground">
                  {dept.count} members
                </div>
                <div className="text-xs text-muted-foreground">
                  {dept.tasks} tasks
                </div>
                <Progress value={dept.percentage} className="h-1 mt-1" />
                <div className="text-xs text-right text-primary">
                  {dept.percentage}% active
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs for Teams and Members */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "teams" | "members")}>
          <TabsList className="mb-4">
            <TabsTrigger value="teams">
              <Users className="mr-2 h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="members">
              <UserPlus className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <div className="flex gap-2 items-center mb-4">
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="relative group">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {team.isFavorite && <Star className="h-4 w-4 text-yellow-400" />}
                        <span>{team.name}</span>
                      </CardTitle>
                      <CardDescription>{team.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSelectedTeam(team)}>
                          <Search className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTeam(team.id)}>
                          <X className="mr-2 h-4 w-4" /> Delete Group
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFavoriteTeam(team.id)}>
                          {team.isFavorite ? (
                            <>
                              <X className="mr-2 h-4 w-4" /> Remove from Favorites
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" /> Mark as Favorite
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAssignDialog(team.id)}>
                          <UserPlus className="mr-2 h-4 w-4" /> Assign Team Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 5).map(member => (
                        <TooltipProvider key={member.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 ring-2 ring-white">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>{member.name}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {team.members.length > 5 && (
                        <span className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-xs ml-2">
                          +{team.members.length - 5}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      {team.members.length} members
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {/* No teams found message */}
              {filteredTeams.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 p-4 text-center text-muted-foreground">
                  No teams found. Try adjusting your search or creating a new team.
                </div>
              )}
            </div>
            {/* Team Details Dialog */}
            <Dialog open={!!selectedTeam} onOpenChange={(open) => { if (!open) setSelectedTeam(null); }}>
              <DialogContent className="sm:max-w-2xl rounded-xl p-0 overflow-hidden border-0 shadow-xl">
                <div className="relative">
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                          {selectedTeam?.isFavorite && (
                            <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                          )}
                          {selectedTeam?.name}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100 mt-1">
                          {selectedTeam?.description}
                        </DialogDescription>
                      </div>
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogClose>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="p-6 space-y-6">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-sm text-blue-600 font-medium">Members</div>
                        <div className="text-2xl font-bold text-blue-800 mt-1">
                          {selectedTeam?.members.length || 0}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-sm text-green-600 font-medium">Active</div>
                        <div className="text-2xl font-bold text-green-800 mt-1">
                          {selectedTeam?.members.filter(m => m.status === "Active").length || 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-sm text-purple-600 font-medium">Tasks</div>
                        <div className="text-2xl font-bold text-purple-800 mt-1">
                          {selectedTeam?.members.reduce((sum, m) => sum + m.tasksAssigned, 0) || 0}
                        </div>
                      </div>
                    </div>

                    {/* Members section */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
                        <Users2 className="h-5 w-5 text-blue-600" />
                        Team Members
                        <Badge variant="outline" className="ml-2">
                          {selectedTeam?.members.length || 0}
                        </Badge>
                      </h3>

                      {selectedTeam && selectedTeam.members.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Users2 className="mx-auto h-10 w-10" />
                          <p className="mt-2">No members in this team yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => {
                              if (selectedTeam) openAssignDialog(selectedTeam.id);
                              setSelectedTeam(null);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Members
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedTeam?.members.map((member) => (
                            <div
                                                          key={member.id}
                              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group relative"
                            >
                              <Avatar className="h-10 w-10 border border-gray-200">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate">{member.name}</p>
                                  {member.isFavorite && (
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {member.role}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    member.status === "Active"
                                      ? "default"
                                      : member.status === "On Leave"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {member.status}
                                </Badge>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setIsViewMemberOpen(true);
                                  }}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    if (window.confirm(`Remove ${member.name} from this team?`)) {
                                      setTeams((prev) =>
                                        prev.map((t) =>
                                          t.id === selectedTeam.id
                                            ? {
                                                ...t,
                                                members: t.members.filter(
                                                  (m) => m.id !== member.id
                                                ),
                                              }
                                            : t
                                        )
                                      );
                                    }
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer with actions */}
                  <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Last updated: {format(new Date(), "MMM d, yyyy")}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedTeam) {
                            toggleFavoriteTeam(selectedTeam.id);
                          }
                        }}
                      >
                        {selectedTeam?.isFavorite ? (
                          <>
                            <X className="mr-2 h-4 w-4" /> Remove Favorite
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" /> Mark Favorite
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedTeam) {
                            openAssignDialog(selectedTeam.id);
                            setSelectedTeam(null);
                          }
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Add Members
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Assign Members to Team Dialog */}
            <Dialog open={!!assignTeamId} onOpenChange={(open) => { if (!open) setAssignTeamId(null); }}>
              <DialogContent className="sm:max-w-lg rounded-xl">
                <DialogHeader>
                  <DialogTitle>
                    Assign Team Members
                  </DialogTitle>
                  <DialogDescription>
                    Select members to assign to this team.
                  </DialogDescription>
                </DialogHeader>
                <MemberCheckboxList
                  value={assignMemberIds}
                  onChange={setAssignMemberIds}
                  allMembers={teamMembers}
                />
                <DialogFooter>
                  <Button
                    onClick={() => {
                      handleAssignMembers();
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" /> Save Assignment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAssignTeamId(null)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue>
                    {statusFilter === "All" ? "All Statuses" : statusFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue>
                    {departmentFilter === "All"
                      ? "All Departments"
                      : departmentFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem value={dept} key={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      Name {getSortIcon("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => requestSort("role")}
                    >
                      Role {getSortIcon("role")}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => requestSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{member.name}</span>
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {member.lastActive}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{member.email}</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyToClipboard(member.email)}>
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "Active" ? "default" : member.status === "On Leave" ? "outline" : "secondary"}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <span>{member.tasksCompleted}/{member.tasksAssigned}</span>
                        <Progress value={member.tasksAssigned ? (member.tasksCompleted / member.tasksAssigned) * 100 : 0} className="h-1 mt-1" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array(Math.round(member.performanceRating || 0)).fill(null).map((_, idx) => (
                            <Star key={idx} className="h-3 w-3 text-yellow-400" />
                          ))}
                          <span className="text-xs ml-1">{member.performanceRating?.toFixed(1) ?? "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getMemberTeams(member.id).map((team) => (
                            <Badge key={team} variant="outline" className="text-xs">{team}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={cn(
                                    "h-7 w-7",
                                    member.isFavorite ? "text-yellow-400" : ""
                                  )}
                                  onClick={() =>
                                    toggleFavoriteMember(member.id)
                                  }
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {member.isFavorite
                                  ? "Remove from favorites"
                                  : "Add to favorites"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => openViewModal(member)}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleAssignTask(member.name)}
                                >
                                  <GanttChart className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Assign Task</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleStartChat(member)}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Start Chat</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleScheduleMeeting(member)}
                                >
                                  <CalendarPlus className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Schedule Meeting</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* No members found message */}
                  {filteredMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="p-4 text-center text-muted-foreground">
                        No members found. Try adjusting your search or adding a new member.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* View Member Dialog */}
            <Dialog open={isViewMemberOpen} onOpenChange={setIsViewMemberOpen}>
              <DialogContent className="sm:max-w-lg rounded-xl">
                {/* Fixed: Only one close button at top */}
                {selectedMember && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedMember.avatar} />
                          <AvatarFallback>
                            {selectedMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedMember.name}</span>
                        {selectedMember.isFavorite && (
                          <Star className="h-5 w-5 text-yellow-400 ml-1" />
                        )}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedMember.role} | {selectedMember.department}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {selectedMember.bio}
                      </div>
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{selectedMember.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarPlus className="h-4 w-4" />
                          <span>
                            Joined{" "}
                            {selectedMember.joinDate
                              ? format(
                                  parseISO(selectedMember.joinDate),
                                  "MMM dd, yyyy"
                                )
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span className="flex flex-wrap gap-1">
                            {getMemberTeams(selectedMember.id).map((team) => (
                              <Badge key={team} variant="outline" className="text-xs">
                                {team}
                              </Badge>
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}