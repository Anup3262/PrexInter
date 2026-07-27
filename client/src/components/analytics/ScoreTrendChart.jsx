import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ScoreTrendChart({ interviews = [] }) {
  const data = interviews
    .filter((item) => item.status === "completed")
    .slice(-10)
    .map((item, index) => ({
      name: `Interview ${index + 1}`,
      score: Number(item.score) || 0,
    }));

  return (
    <section className="app-card p-6 transition hover:shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-950">
          Score trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Performance across your latest completed interviews
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-center">
          <div>
            <p className="font-semibold text-slate-700">
              No score data yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Complete an interview to see your progress.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 30px rgba(15, 23, 42, 0.1)",
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#4f46e5",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ScoreTrendChart;