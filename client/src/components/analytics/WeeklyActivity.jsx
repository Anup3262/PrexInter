import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function WeeklyActivity({ interviews = [] }) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const data = days.map((day) => ({
    day: day.slice(0, 3),
    interviews: 0,
  }));

  interviews.forEach((interview) => {
    const date = new Date(interview.createdAt);

    if (!Number.isNaN(date.getTime())) {
      data[date.getDay()].interviews += 1;
    }
  });

  const total = data.reduce(
    (sum, item) => sum + item.interviews,
    0
  );

  return (
    <section className="app-card p-6 transition hover:shadow-xl">
      <h2 className="text-xl font-bold text-slate-950">
        Weekly activity
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Interviews created by weekday
      </p>

      {total === 0 ? (
        <div className="flex h-72 items-center justify-center text-center">
          <p className="text-slate-500">
            No weekly activity yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="activityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#6366f1"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="#6366f1"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="interviews"
                stroke="#6366f1"
                fill="url(#activityGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default WeeklyActivity;