"use client";
import Header from "@/components/local/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen gap-[50px] md:gap-[100px]">
      {/* Sticky header */}
      <Header />

      {/* Page content */}
      <div className="flex-1 w-full md:px-16 py-6">{children}</div>
    </main>
  );
};

export default MainLayout;
