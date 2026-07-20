import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  FileText,
  MessageSquare,
  User,
} from "lucide-react";

import { NavigationItem } from "../types/navigation";
import { Role } from "../types/role";

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [Role.ADMIN, Role.MANAGER, Role.BUDDY, Role.INTERN],
  },

  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: [Role.ADMIN],
  },

  {
    title: "Interns",
    href: "/interns",
    icon: GraduationCap,
    roles: [Role.MANAGER, Role.BUDDY,Role.ADMIN],
  },

  {
    title: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
    roles: [
      Role.MANAGER,
      Role.BUDDY,
      Role.INTERN,
    ],
  },

  {
    title: "Daily Updates",
    href: "/daily-updates",
    icon: CalendarDays,
    roles: [
      Role.INTERN,
      Role.MANAGER,
      Role.BUDDY,
    ],
  },

  {
    title: "Weekly Reports",
    href: "/weekly-reports",
    icon: FileText,
    roles: [
      Role.INTERN,
      Role.MANAGER,
    ],
  },

  {
    title: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
    roles: [
      Role.INTERN,
      Role.BUDDY,
      Role.MANAGER,
    ],
  },

  {
    title: "Profile",
    href: "/profile",
    icon: User,
    roles: [
      Role.ADMIN,
      Role.MANAGER,
      Role.BUDDY,
      Role.INTERN,
    ],
  },
];