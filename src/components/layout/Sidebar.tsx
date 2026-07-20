import { ScrollArea } from "@/components/ui/scroll-area";

import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";

import { siteConfig } from "@/lib/config/site";

export default function Sidebar() {
  return (
    <aside
      className="flex h-full w-full flex-col border-r border-sidebar-border bg-sidebar"
      style={{
        width: siteConfig.sidebarWidth,
      }}
    >
      <SidebarHeader />

      <ScrollArea className="flex-1">
        <SidebarNav />
      </ScrollArea>

      <UserMenu />
    </aside>
  );
}
