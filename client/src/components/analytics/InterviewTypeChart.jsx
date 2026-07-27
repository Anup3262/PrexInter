import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function InterviewTypeChart({ types = {} }) {
  const data = [
    {
      name: "Technical",
      value: Number(types.Technical) || 0,
    },
    {
      name: "HR",
      value: Number(types.HR) || 0,
    },
    {
      name: "Behavioral",
      value: Number(types.Behavioral) || 0,
    },
    {
      name: "Mixed",
      value: Number(types.Mixed) || 0,
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="app-card p-6 transition hover:shadow-xl">
      <h2 className="text-xl font-bold text-slate-950">
        Interview types
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Practice distribution by interview format
      </p>

      {total === 0 ? (
        <div className="flex h-72 items-center justify-center text-center">
          <p className="text-slate-500">
            No interview type data yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#6366f1"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default InterviewTypeChart;