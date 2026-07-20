"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
}

export default function SidebarItem({
  title,
  href,
  icon: Icon,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-blue-950/70 text-white border-l-[4px] border-blue-500"
          : "text-slate-300 hover:bg-slate-900 hover:text-white"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-400" : "text-slate-400")} />

      <span>{title}</span>
    </Link>
  );
}
