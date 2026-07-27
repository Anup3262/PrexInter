import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BrainCircuit,
  CirclePlay,
  Plus,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/dashboard/Hero";
import StatCard from "../components/dashboard/StatCard";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import ActivityCard from "../components/dashboard/ActivityCard";
import InterviewCard from "../components/dashboard/InterviewCard";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchInterviews = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/interviews");

      setInterviews(
        Array.isArray(response.data?.interviews)
          ? response.data.interviews
          : []
      );
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to load interviews";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const stats = useMemo(() => {
    const completedInterviews = interviews.filter(
      (interview) => interview.status === "completed"
    );

    const scores = completedInterviews
      .map((interview) => Number(interview.score))
      .filter(Number.isFinite);

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((total, score) => total + score, 0) /
              scores.length
          )
        : 0;

    const bestScore =
      scores.length > 0 ? Math.max(...scores) : 0;

    return {
      total: interviews.length,
      completed: completedInterviews.length,
      averageScore,
      bestScore,
    };
  }, [interviews]);

  const recentInterviews = useMemo(
    () => interviews.slice(0, 6),
    [interviews]
  );

  const deleteInterview = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(interviewId);

      await api.delete(`/interviews/${interviewId}`);

      setInterviews((currentInterviews) =>
        currentInterviews.filter(
          (interview) => interview._id !== interviewId
        )
      );

      toast.success("Interview deleted");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to delete interview";

      toast.error(message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Sidebar />

      <div className="min-h-screen lg:pl-64">
        <Navbar />

        <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <Hero stats={stats} />

          <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
              value={stats.averageScore}
              suffix="%"
              subtitle="Across completed interviews"
              icon={Award}
            />

            <StatCard
              title="Best score"
              value={stats.bestScore}
              suffix="%"
              subtitle="Your strongest performance"
              icon={BrainCircuit}
            />
          </section>

          {error && (
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              <p>{error}</p>

              <button
                type="button"
                onClick={fetchInterviews}
                className="shrink-0 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold transition hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              <section className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                <PerformanceChart interviews={interviews} />

                <ActivityCard interviews={interviews} />
              </section>

              <section className="mt-10">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">
                      Recent interviews
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Continue practising or review your completed
                      results.
                    </p>
                  </div>

                  {interviews.length > 0 && (
                    <button
                      type="button"
                      onClick={() => navigate("/interviews")}
                      className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                      View all
                    </button>
                  )}
                </div>

                {recentInterviews.length === 0 ? (
                  <EmptyInterviewState
                    onCreate={() =>
                      navigate("/interviews/create")
                    }
                  />
                ) : (
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {recentInterviews.map((interview) => (
                      <div
                        key={interview._id}
                        className={
                          deletingId === interview._id
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        <InterviewCard
                          interview={interview}
                          onDelete={deleteInterview}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function EmptyInterviewState({ onCreate }) {
  return (
    <div className="app-card mt-6 flex min-h-80 items-center justify-center border-dashed p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600">
          <BrainCircuit size={32} />
        </span>

        <h3 className="mt-5 text-2xl font-black text-slate-950">
          No interviews yet
        </h3>

        <p className="mt-2 leading-7 text-slate-500">
          Create your first AI-powered mock interview and receive
          personalised questions, feedback, scores, and ideal
          answers.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="primary-button mt-6"
        >
          <Plus size={18} />
          Create interview
        </button>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="h-96 animate-pulse rounded-3xl bg-white/80 shadow-sm" />
        <div className="h-96 animate-pulse rounded-3xl bg-white/80 shadow-sm" />
      </div>

      <div>
        <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-3xl bg-white/80 shadow-sm" />
          <div className="h-72 animate-pulse rounded-3xl bg-white/80 shadow-sm" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;