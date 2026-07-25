import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
        <h1 className="text-2xl font-bold text-indigo-400">
          PrexInter
        </h1>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-300 sm:block">
            {user?.name}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome, {user?.name}
            </h2>

            <p className="mt-2 text-slate-600">
              Practice interviews and improve with AI-generated questions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/interviews/create")}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Start new interview
          </button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total interviews
            </p>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {interviews.length}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {
                interviews.filter(
                  (interview) => interview.status === "completed"
                ).length
              }
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              In progress
            </p>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {
                interviews.filter(
                  (interview) =>
                    interview.status === "in-progress"
                ).length
              }
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Average score
            </p>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              —
            </p>
          </article>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">
              My interviews
            </h3>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-600">
              Loading interviews...
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && interviews.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <h4 className="text-xl font-semibold text-slate-900">
                No interviews yet
              </h4>

              <p className="mt-2 text-slate-500">
                Create your first AI-powered mock interview.
              </p>

              <button
                type="button"
                onClick={() => navigate("/interviews/create")}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Create interview
              </button>
            </div>
          )}

          {!loading && !error && interviews.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {interviews.map((interview) => (
                <article
                  key={interview._id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {interview.role}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        {interview.type}
                      </p>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {interview.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400">Difficulty</p>
                      <p className="font-semibold text-slate-700">
                        {interview.difficulty}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Questions</p>
                      <p className="font-semibold text-slate-700">
                        {interview.questionCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Duration</p>
                      <p className="font-semibold text-slate-700">
                        {interview.duration} min
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/interviews/${interview._id}`)
                    }
                    className="mt-6 w-full rounded-lg border border-indigo-600 px-4 py-3 font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    Open interview
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;