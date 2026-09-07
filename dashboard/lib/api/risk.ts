export type RiskRecord = {
  region: string; location: string; latitude: number; longitude: number;
  historical_spatial_risk_score: number; risk_level: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  cluster: number; anomaly_score: number; severity_score: number; crime_density: number;
};

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export async function getLocalityRisks(): Promise<RiskRecord[]> {
  const response = await fetch(`${base}/api/risk/localities`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Risk API returned ${response.status}`);
  const data: unknown = await response.json();
  if (!Array.isArray(data) || data.some((x) => typeof x !== "object" || x === null || typeof (x as RiskRecord).latitude !== "number")) throw new Error("Risk API returned invalid data");
  return data as RiskRecord[];
}
