import {
  Award,
  BrainCircuit,
  CheckCircle2,
  Target,
} from "lucide-react";

function AIInsights({ analytics = {} }) {
  const {
    averageScore = 0,
    bestScore = 0,
    completionRate = 0,
    difficulty = {},
  } = analytics;

  const strongestDifficulty =
    Object.entries(difficulty).sort(
      (first, second) => second[1] - first[1]
    )[0]?.[0] || "No data";

  const insights = [
    {
      title: "Average performance",
      value: `${averageScore}%`,
      icon: BrainCircuit,
    },
    {
      title: "Best performance",
      value: `${bestScore}%`,
      icon: Award,
    },
    {
      title: "Completion rate",
      value: `${completionRate}%`,
      icon: CheckCircle2,
    },
    {
      title: "Most practised level",
      value: strongestDifficulty,
      icon: Target,
    },
  ];

  return (
    <section className="app-card p-6 transition hover:shadow-xl">
      <h2 className="text-xl font-bold text-slate-950">
        AI insights
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Summary of your current interview performance
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <div
              key={insight.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <Icon size={20} className="text-indigo-600" />

              <p className="mt-3 text-sm text-slate-500">
                {insight.title}
              </p>

              <p className="mt-1 text-xl font-bold text-slate-950">
                {insight.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AIInsights;