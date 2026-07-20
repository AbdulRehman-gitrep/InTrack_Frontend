import { SessionProvider } from "@/lib/context/session"
import AppShell from "@/components/layout/Appshell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppShell
        title="Dashboard"
        titleClassName="text-blue-700"
      >
        {children}
      </AppShell>
    </SessionProvider>
  );
}