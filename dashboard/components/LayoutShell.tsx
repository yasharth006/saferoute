'use client';

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <AuthGuard>
      {isLoginPage ? (
        children
      ) : (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-zinc-50 min-h-screen p-8">{children}</main>
        </div>
      )}
    </AuthGuard>
  );
}