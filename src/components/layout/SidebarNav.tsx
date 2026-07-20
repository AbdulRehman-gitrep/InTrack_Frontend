import SidebarItem from "./SidebarItem";

import { navigation } from "@/lib/config/navigation";
import { useSession } from "@/lib/context/session";

export default function SidebarNav() {
  const { role } = useSession();

  const items = navigation.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <nav className="flex flex-col gap-1.5 px-3 py-4">
      {items.map((item) => (
        <SidebarItem
          key={item.href}
          title={item.title}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </nav>
  );
}
