import incidents from "@/lib/mock/incidents.json";

const severityColor: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const statusColor: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  resolved: "bg-zinc-100 text-zinc-600",
};

export default function IncidentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Incidents</h1>
      <p className="text-zinc-500 mt-1">
        {incidents.length} incident{incidents.length !== 1 ? "s" : ""} reported
      </p>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Description</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Severity</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Reported</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium text-zinc-900">{incident.category}</td>
                <td className="px-4 py-3 text-zinc-600">{incident.description}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColor[incident.severity]}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[incident.status]}`}>
                    {incident.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(incident.reportedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}