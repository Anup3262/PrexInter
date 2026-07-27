import { Flag, Trophy } from "lucide-react";

function GoalProgress({
  totalInterviews = 0,
  goal = 100,
}) {
  const progress = Math.min(
    100,
    Math.round((totalInterviews / goal) * 100)
  );

  return (
    <section className="app-card p-6 transition hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Interview goal
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete {goal} practice interviews
          </p>
        </div>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Flag size={22} />
        </span>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-black text-slate-950">
              {totalInterviews}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              of {goal} interviews
            </p>
          </div>

          <p className="text-lg font-bold text-indigo-600">
            {progress}%
          </p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {progress >= 100 && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-amber-700">
            <Trophy size={22} />

            <p className="font-semibold">
              Goal completed. Excellent consistency!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default GoalProgress;