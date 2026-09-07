import complaints from "@/lib/mock/complaints.json";
import incidents from "@/lib/mock/incidents.json";

const statusColor: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  resolved: "bg-zinc-100 text-zinc-600",
};

export default function ComplaintsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Complaints</h1>
      <p className="text-zinc-500 mt-1">
        {complaints.length} complaint{complaints.length !== 1 ? "s" : ""} tracked
      </p>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Related Incident</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Assigned To</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Last Updated</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => {
              const incident = incidents.find((i) => i.id === complaint.incidentId);
              return (
                <tr key={complaint.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {incident ? incident.category : "Unknown"}
                    <div className="text-xs text-zinc-400 font-normal">{incident?.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[complaint.status]}`}>
                      {complaint.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {complaint.assignedTo || <span className="text-zinc-400">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(complaint.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                      Mark Resolved
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}