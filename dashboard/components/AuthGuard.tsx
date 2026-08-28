'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("saferoute_admin_session") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-check on every route change, not just mount
    setIsLoggedIn(loggedIn);
  }, [pathname]);

  useEffect(() => {
    if (isLoggedIn === null) return;

    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login");
    } else if (isLoggedIn && pathname === "/login") {
      router.push("/");
    }
  }, [isLoggedIn, pathname, router]);

  const stillChecking = isLoggedIn === null;
  const stillRedirecting =
    (!isLoggedIn && pathname !== "/login") || (isLoggedIn && pathname === "/login");

  if (stillChecking || stillRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}