import { LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useSession } from "@/lib/context/session";

export default function UserMenu() {
  const { user, logout } = useSession();

  return (
    <>
      <Separator className="bg-sidebar-border" />

      <div className="flex items-center gap-3 px-4 py-4">

        <Avatar>
          <AvatarFallback className="bg-blue-600 text-white">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">

          <p className="truncate text-sm font-semibold text-white">
            {user.fullName}
          </p>

          <p className="text-xs text-slate-400 capitalize">
            {user.role}
          </p>

        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={logout}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="size-4" />
        </Button>

      </div>
    </>
  );
}
