import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SafeRoute Admin Dashboard",
  description: "Admin dashboard for SafeRoute urban safety platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-zinc-50 min-h-screen p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}