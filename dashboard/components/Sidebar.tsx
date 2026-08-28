'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, AlertTriangle, ClipboardList, BarChart3 } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Complaints", href: "/complaints", icon: ClipboardList },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 h-screen bg-zinc-950 text-zinc-100 flex flex-col border-r border-zinc-800">
      <div className="px-6 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-semibold">SafeRoute</h1>
        <p className="text-xs text-zinc-500">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-500">Logged in as Admin</span>
        <button
          onClick={() => {
            localStorage.removeItem("saferoute_admin_session");
            router.push("/login");
          }}
          className="text-xs text-zinc-500 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}