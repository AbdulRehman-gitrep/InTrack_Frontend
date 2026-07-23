import AppShell from "@/components/layout/Appshell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppShell
        title="Dashboard"
        titleClassName="text-blue-700"
      >
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}