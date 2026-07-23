import { SessionProvider } from "@/lib/context/session"
import AppShell from "@/components/layout/Appshell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ProtectedRoute>
        <AppShell
          title="Dashboard"
          titleClassName="text-blue-700"
        >
          {children}
        </AppShell>
      </ProtectedRoute>
    </SessionProvider>
  );
}