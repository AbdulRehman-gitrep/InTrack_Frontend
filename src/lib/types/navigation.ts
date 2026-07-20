import { LucideIcon } from "lucide-react";
import { Role } from "./role";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}