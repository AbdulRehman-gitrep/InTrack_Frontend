"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import TopBar from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  titleClassName?: string;
}

export default function AppShell({
  children,
  title,
  titleClassName,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <MobileSidebar
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">

        <TopBar
          title={title}
          titleClassName={titleClassName}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">

          {children}

        </main>

      </div>

    </div>
  );
}