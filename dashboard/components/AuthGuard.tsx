'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("saferoute_admin_session") === "true";

    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login");
    } else if (isLoggedIn && pathname === "/login") {
      router.push("/");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // Avoid flashing protected content before the check completes
  if (!checked && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}