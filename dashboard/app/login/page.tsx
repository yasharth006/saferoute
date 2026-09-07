'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Mock auth — no real backend yet. Any non-empty email/password works.
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Store a mock session flag so the layout knows we're "logged in"
    localStorage.setItem("saferoute_admin_session", "true");
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-zinc-900 text-white rounded-full p-3 mb-3">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">SafeRoute</h1>
          <p className="text-sm text-zinc-500">Admin Dashboard Login</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@saferoute.gov"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </button>

          <p className="text-xs text-zinc-400 text-center pt-2">
            Demo build — any email/password will work
          </p>
        </form>
      </div>
    </div>
  );
}