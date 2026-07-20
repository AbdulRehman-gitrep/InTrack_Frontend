"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSidebar({
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[260px] p-0 h-full bg-sidebar"
        showCloseButton={false}
      >
        <Sidebar />

        <SheetPrimitive.Close
          data-slot="sheet-close"
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            />
          }
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetContent>
    </Sheet>
  );
}
