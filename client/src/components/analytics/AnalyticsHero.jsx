import { Sparkles } from "lucide-react";

function AnalyticsHero() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-700 p-8 text-white shadow-xl">
      <div className="flex items-center gap-4">
        <Sparkles size={40} />

        <div>
          <h1 className="text-4xl font-bold">
            Analytics Dashboard
          </h1>

          <p className="mt-2 text-indigo-100">
            Track your interview progress with AI insights.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsHero;