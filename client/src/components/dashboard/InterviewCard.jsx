import {
  Calendar,
  Clock3,
  Eye,
  Play,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function InterviewCard({ interview, onDelete }) {
  const navigate = useNavigate();

  const difficultyColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  const statusColor = {
    pending: "bg-slate-100 text-slate-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            {interview.role}
          </h2>

          <div className="mt-3 flex gap-2 flex-wrap">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                difficultyColor[interview.difficulty]
              }`}
            >
              {interview.difficulty}
            </span>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {interview.type}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusColor[interview.status]
              }`}
            >
              {interview.status}
            </span>

          </div>

        </div>

        {interview.status === "completed" && (
          <div className="text-right">

            <p className="text-3xl font-bold text-indigo-600">
              {interview.score}%
            </p>

            <p className="text-xs text-slate-500">
              Overall Score
            </p>

          </div>
        )}

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-slate-50 p-4">

          <Clock3
            className="mb-2 text-indigo-600"
            size={18}
          />

          <p className="text-sm text-slate-500">
            Duration
          </p>

          <p className="font-semibold">
            {interview.duration} mins
          </p>

        </div>

        <div className="rounded-2xl bg-slate-50 p-4">

          <Calendar
            className="mb-2 text-indigo-600"
            size={18}
          />

          <p className="text-sm text-slate-500">
            Questions
          </p>

          <p className="font-semibold">
            {interview.questionCount}
          </p>

        </div>

      </div>

      <div className="mt-6 flex gap-3">

        {interview.status === "completed" ? (
          <button
            onClick={() =>
              navigate(`/result/${interview._id}`)
            }
            className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            <Eye
              size={18}
              className="mr-2 inline"
            />
            View Result
          </button>
        ) : (
          <button
            onClick={() =>
              navigate(`/interview/${interview._id}`)
            }
            className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            <Play
              size={18}
              className="mr-2 inline"
            />
            Continue
          </button>
        )}

        <button
          onClick={() => onDelete(interview._id)}
          className="rounded-xl border border-red-200 px-4 text-red-600 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}

export default InterviewCard;