import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";

import { siteConfig } from "@/lib/config/site";

export default function Sidebar() {
  return (
    <aside
      className="flex h-full max-h-full w-full flex-col border-r border-sidebar-border bg-sidebar"
      style={{
        width: siteConfig.sidebarWidth,
      }}
    >
      <SidebarHeader />

      <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
        <SidebarNav />
      </div>

      <div className="mt-auto">
        <UserMenu />
      </div>
    </aside>
  );
}
