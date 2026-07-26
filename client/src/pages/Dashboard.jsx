import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BrainCircuit,
  CirclePlay,
  Clock3,
  Plus,
  Target,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/dashboard/Hero";
import api from "../services/api";
import StatCard from "../components/dashboard/StatCard";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import ActivityCard from "../components/dashboard/ActivityCard";
import InterviewCard from "../components/dashboard/InterviewCard";


function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(response.data.interviews || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load interviews"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const stats = useMemo(() => {
    const completed = interviews.filter(
      (item) => item.status === "completed"
    );

    const scores = completed
      .map((item) => Number(item.score) || 0)
      .filter((score) => score >= 0);

    const averageScore = scores.length
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) /
            scores.length
        )
      : 0;

    const bestScore = scores.length
      ? Math.max(...scores)
      : 0;

    return {
      total: interviews.length,
      completed: completed.length,
      averageScore,
      bestScore,
    };
  }, [interviews]);

  const deleteInterview = async (id) => {
  try {
    await api.delete(`/interviews/${id}`);
    fetchInterviews();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-indigo-200">
                <BrainCircuit size={16} />
                AI-powered mock interviews
              </span>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Prepare with purpose.
                <span className="block text-indigo-400">
                  Interview with confidence.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-slate-300">
                Generate role-specific questions, practise answers,
                and receive structured AI feedback.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/interviews/create")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              <Plus size={20} />
              Start new interview
            </button>
          </div>
        </div>

        <button
              onClick={() => navigate("/resume-interview")}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold"
               >
               📄 Resume Interview
        </button>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total interviews"
            value={stats.total}
            subtitle="All interview sessions"
            icon={CirclePlay}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Evaluated interviews"
            icon={Target}
          />

          <StatCard
            title="Average score"
            value={`${stats.averageScore}%`}
            subtitle="Across completed interviews"
            icon={Award}
          />

          <StatCard
            title="Best score"
            value={`${stats.bestScore}%`}
            subtitle="Your strongest performance"
            icon={BrainCircuit}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
                  <PerformanceChart interviews={interviews} />

               <ActivityCard interviews={interviews} />
        </div>

        <div className="mt-10">

  <div className="flex items-center justify-between">

    <h2 className="text-2xl font-bold">
      Recent Interviews
    </h2>

    <button
      className="text-indigo-600 font-semibold"
    >
      View All
    </button>

  </div>

  <div className="mt-6 grid gap-6 lg:grid-cols-2">

    {interviews.map((item) => (
      <InterviewCard
        key={item._id}
        interview={item}
        onDelete={deleteInterview}
      />
    ))}

  </div>

</div>

        {loading && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading interviews...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && interviews.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BrainCircuit
              className="mx-auto text-indigo-600"
              size={42}
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No interviews yet
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first AI-powered mock interview.
            </p>

            <button
              type="button"
              onClick={() => navigate("/interviews/create")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create interview
            </button>
          </div>
        )}

        

        {!loading && !error && interviews.length > 0 && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {interviews.map((interview) => {
              const completed =
                interview.status === "completed";

              return (
                <article
                  key={interview._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">
                        {interview.role}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {interview.type}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        completed
                          ? "bg-emerald-50 text-emerald-700"
                          : interview.status === "in-progress"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Difficulty
                      </p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {interview.difficulty}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Questions
                      </p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {interview.questionCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Duration
                      </p>
                      <p className="mt-1 flex items-center gap-1 font-semibold text-slate-700">
                        <Clock3 size={15} />
                        {interview.duration} min
                      </p>
                    </div>
                  </div>

                  {completed && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">
                        Final score
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-950">
                        {interview.score}%
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        completed
                          ? `/result/${interview._id}`
                          : `/interviews/${interview._id}`
                      )
                    }
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-600 px-4 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    {completed ? "View result" : "Continue interview"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;