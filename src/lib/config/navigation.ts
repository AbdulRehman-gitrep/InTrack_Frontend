import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  FileText,
  MessageSquare,
  User,
  Clock,
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
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: [
      Role.INTERN,
      Role.MANAGER,
      Role.BUDDY,
    ],
  },

  {
    title: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
    roles: [Role.INTERN, Role.BUDDY, Role.MANAGER],
  },

  {
    title: "Activity",
    href: "/activity",
    icon: Clock,
    roles: [Role.ADMIN, Role.MANAGER],
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