import { Sparkles, TrendingUp } from "lucide-react";

function AnalyticsHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-2xl">

      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
            <Sparkles size={16} />
            AI Powered Analytics
          </div>

          <h1 className="mt-5 text-5xl font-black">
            Analytics Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Monitor your interview performance, identify weak
            areas and improve with AI-generated insights.
          </p>

        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

          <TrendingUp
            size={42}
            className="mb-4"
          />

          <p className="text-sm text-indigo-100">
            Performance Growth
          </p>

          <h2 className="mt-2 text-4xl font-black">
            +28%
          </h2>

          <p className="mt-2 text-sm text-indigo-100">
            compared with last month
          </p>

        </div>

      </div>

    </section>
  );
}

export default AnalyticsHero;