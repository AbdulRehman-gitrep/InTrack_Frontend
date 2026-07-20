import Brand from "@/components/common/Brand";

export default function SidebarHeader() {
  return (
    <div className="border-b border-sidebar-border px-6 py-6">
      <Brand
        variant="sidebar"
        centered={false}
        subtitle="Streamlining Internship Management"
      />
    </div>
  );
}
