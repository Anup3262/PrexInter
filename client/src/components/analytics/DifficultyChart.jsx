import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function DifficultyChart({ difficulty = {} }) {
  const data = [
    { name: "Easy", value: Number(difficulty.Easy) || 0 },
    { name: "Medium", value: Number(difficulty.Medium) || 0 },
    { name: "Hard", value: Number(difficulty.Hard) || 0 },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colors = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <section className="app-card p-6 transition hover:shadow-xl">
      <h2 className="text-xl font-bold text-slate-950">
        Difficulty distribution
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Breakdown of interviews by difficulty
      </p>

      {total === 0 ? (
        <div className="flex h-72 items-center justify-center text-center">
          <div>
            <p className="font-semibold text-slate-700">
              No difficulty data yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Create interviews to populate this chart.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={colors[index]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default DifficultyChart;