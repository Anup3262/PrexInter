import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function PerformanceChart({ interviews = [] }) {
  const chartData = interviews
    .filter((item) => item.status === "completed")
    .slice(0, 10)
    .reverse()
    .map((item, index) => ({
      interview: index + 1,
      score: item.score || 0,
    }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Performance Trend
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Your last completed interviews
      </p>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="5 5" />

            <XAxis dataKey="interview" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366F1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceChart;