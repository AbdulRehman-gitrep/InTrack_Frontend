"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  titleClassName?: string;
}

export default function TopBar({
  title,
  onMenuClick,
  titleClassName,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-6">

      <Button
        variant="ghost"
        size="icon"
        className="mr-3 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className={cn("text-xl font-bold text-slate-900", titleClassName)}>
        {title}
      </h1>

    </header>
  );
}
