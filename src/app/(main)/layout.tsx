"use client";
import Header from "@/components/local/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen gap-[100px]">
      {/* Sticky header */}
      <Header />

      {/* Page content */}
      <div className="flex-1 w-full px-4 md:px-8 lg:px-16 py-6">{children}</div>
    </main>
  );
};

export default MainLayout;
