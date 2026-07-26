import {
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

function ActivityCard({ interviews = [] }) {
  const latest = interviews.slice(0, 5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-5">
        {latest.map((item) => (
          <div
            key={item._id}
            className="flex gap-4"
          >
            <div>
              {item.status === "completed" ? (
                <CheckCircle2
                  className="text-green-600"
                  size={20}
                />
              ) : (
                <Clock3
                  className="text-amber-600"
                  size={20}
                />
              )}
            </div>

            <div>
              <p className="font-semibold">
                {item.role}
              </p>

              <p className="text-sm text-slate-500">
                {item.status}
              </p>
            </div>
          </div>
        ))}

        {!latest.length && (
          <div className="text-center text-slate-400">
            <FileText
              size={32}
              className="mx-auto mb-3"
            />
            No activity yet
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;