'use client';
import { useEffect, useState } from "react";
import { getLocalityRisks, RiskRecord } from "@/lib/api/risk";

const colors: Record<string, string> = { LOW: "#16a34a", MEDIUM: "#eab308", HIGH: "#f97316", VERY_HIGH: "#dc2626" };
export default function RiskMap() {
  const [points, setPoints] = useState<RiskRecord[]>([]); const [error, setError] = useState("");
  useEffect(() => { getLocalityRisks().then(setPoints).catch((e) => setError(e.message)); }, []);
  if (error) return <p className="text-red-600">Unable to load ML risk map: {error}</p>;
  if (!points.length) return <p className="text-zinc-500">Loading ML risk map...</p>;
  const minLat = Math.min(...points.map((p) => p.latitude)), maxLat = Math.max(...points.map((p) => p.latitude));
  const minLon = Math.min(...points.map((p) => p.longitude)), maxLon = Math.max(...points.map((p) => p.longitude));
  return <div><svg viewBox="0 0 800 420" className="w-full h-[420px] rounded-lg bg-slate-100" role="img" aria-label="Delhi ML historical spatial risk map">{points.map((p) => <circle key={`${p.location}-${p.latitude}`} cx={30 + ((p.longitude-minLon)/(maxLon-minLon))*740} cy={390 - ((p.latitude-minLat)/(maxLat-minLat))*360} r={4 + p.historical_spatial_risk_score*5} fill={colors[p.risk_level]} opacity=".75"><title>{`${p.location}: ${p.risk_level} (${p.historical_spatial_risk_score.toFixed(2)})`}</title></circle>)}</svg><div className="flex gap-4 mt-3 text-xs">{Object.entries(colors).map(([level, color]) => <span key={level}><i className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }} />{level}</span>)}</div></div>;
}
