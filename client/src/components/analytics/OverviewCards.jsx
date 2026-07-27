import {
  Award,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

import StatCard from "../dashboard/StatCard";

function OverviewCards({ analytics }) {
  return (
    <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Average score"
        value={Number(analytics?.averageScore) || 0}
        suffix="%"
        subtitle="Across completed interviews"
        icon={TrendingUp}
      />

      <StatCard
        title="Best score"
        value={Number(analytics?.bestScore) || 0}
        suffix="%"
        subtitle="Your highest performance"
        icon={Award}
      />

      <StatCard
        title="Completion rate"
        value={Number(analytics?.completionRate) || 0}
        suffix="%"
        subtitle="Interviews successfully completed"
        icon={CheckCircle2}
      />

      <StatCard
        title="Total interviews"
        value={Number(analytics?.totalInterviews) || 0}
        subtitle="All practice sessions"
        icon={ClipboardList}
      />
    </section>
  );
}

export default OverviewCards;