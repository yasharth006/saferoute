'use client';

import incidents from "@/lib/mock/incidents.json";
import RiskMap from "@/components/RiskMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Group incidents by category
const categoryCounts = incidents.reduce((acc: Record<string, number>, incident) => {
  acc[incident.category] = (acc[incident.category] || 0) + 1;
  return acc;
}, {});

const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
  category,
  count,
}));

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Analytics</h1>
      <p className="text-zinc-500 mt-1">Incident trends and zone safety scores</p>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 mt-6">
        <h2 className="text-sm font-medium text-zinc-700 mb-4">Delhi Historical ML Risk</h2>
        <RiskMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-sm font-medium text-zinc-700 mb-4">Incidents by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
