import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import AnalyticsHero from "../components/analytics/AnalyticsHero";
import OverviewCards from "../components/analytics/OverviewCards";
import ScoreTrendChart from "../components/analytics/ScoreTrendChart";
import DifficultyChart from "../components/analytics/DifficultyChart";
import InterviewTypeChart from "../components/analytics/InterviewTypeChart";
import WeeklyActivity from "../components/analytics/WeeklyActivity";
import AIInsights from "../components/analytics/AIInsights";
import GoalProgress from "../components/analytics/GoalProgress";
import api from "../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/analytics");
        setAnalytics(response.data.analytics);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading analytics...</p>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Analytics data not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Navbar />

        <section className="mx-auto max-w-7xl p-8">
          <AnalyticsHero />

          <OverviewCards analytics={analytics} />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <ScoreTrendChart
              interviews={analytics.interviews}
            />

            <DifficultyChart
              difficulty={analytics.difficulty}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <InterviewTypeChart
              types={analytics.types}
            />

            <WeeklyActivity
              interviews={analytics.interviews}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <AIInsights analytics={analytics} />

            <GoalProgress
              totalInterviews={analytics.totalInterviews}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Analytics;