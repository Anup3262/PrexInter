import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import api from "../services/api";

function Result() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);
        setInterview(response.data.interview);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load interview result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const rawScore = useMemo(() => {
    if (!interview?.questions?.length) {
      return 0;
    }

    return interview.questions.reduce(
      (sum, question) => sum + (Number(question.score) || 0),
      0
    );
  }, [interview]);

  const maximumRawScore =
    (interview?.questions?.length || 0) * 10;

  const performance = getPerformance(interview?.score || 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading interview result...
      </main>
    );
  }

  if (error || !interview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <section className="max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <p className="text-red-600">
            {error || "Interview not found"}
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-indigo-200">
                <Sparkles size={16} />
                Interview completed
              </span>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                {interview.role}
              </h1>

              <p className="mt-3 text-slate-300">
                {interview.difficulty} · {interview.type} ·{" "}
                {interview.questions.length} questions
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <Award size={20} className="text-amber-300" />

                <div>
                  <p className="text-sm text-slate-300">
                    Performance
                  </p>
                  <p className="font-bold text-white">
                    {performance.label}
                  </p>
                </div>
              </div>
            </div>

            <ScoreCircle score={interview.score || 0} />
          </div>
        </motion.section>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ResultStat
            title="Overall score"
            value={`${interview.score || 0}/100`}
            subtitle="Percentage score"
          />

          <ResultStat
            title="Raw score"
            value={`${rawScore}/${maximumRawScore}`}
            subtitle="Question-wise total"
          />

          <ResultStat
            title="Questions"
            value={interview.questions.length}
            subtitle="Evaluated responses"
          />

          <ResultStat
            title="Status"
            value="Completed"
            subtitle="Interview evaluated"
          />
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Target size={22} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Overall summary
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {interview.summary ||
                  "No overall summary was generated."}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Question breakdown
            </h2>

            <p className="mt-1 text-slate-500">
              Review your answers, feedback, and model answers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/interviews/create")}
            className="hidden items-center gap-2 rounded-xl border border-indigo-600 px-4 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:inline-flex"
          >
            <RotateCcw size={18} />
            New interview
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {interview.questions.map((question, index) => {
            const expanded = expandedQuestion === index;
            const score = Number(question.score) || 0;

            return (
              <motion.article
                key={question._id || index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-6 md:p-7">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="max-w-4xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          Question {index + 1}
                        </span>

                        <span className="text-sm text-slate-500">
                          {question.category || "General"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold leading-relaxed text-slate-950">
                        {question.question}
                      </h3>
                    </div>

                    <ScoreBadge score={score} />
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <AnswerPanel
                      title="Your answer"
                      text={
                        question.answer ||
                        "No answer was submitted."
                      }
                    />

                    <AnswerPanel
                      title="AI feedback"
                      text={
                        question.feedback ||
                        "No feedback was generated."
                      }
                      highlight
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedQuestion(
                        expanded ? null : index
                      )
                    }
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-indigo-600"
                  >
                    {expanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}

                    {expanded
                      ? "Hide ideal answer"
                      : "Show ideal answer"}
                  </button>
                </div>

                {expanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-7">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={20}
                        className="mt-1 shrink-0 text-emerald-600"
                      />

                      <div>
                        <h4 className="font-bold text-slate-950">
                          Ideal answer
                        </h4>

                        <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                          {question.idealAnswer ||
                            "No ideal answer was generated."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/interviews/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            <RotateCcw size={18} />
            Start another interview
          </button>
        </div>
      </section>
    </main>
  );
}

function ScoreCircle({ score }) {
  const safeScore = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  );

  return (
    <div
      className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#818cf8 ${safeScore}%, rgba(255,255,255,0.12) ${safeScore}% 100%)`,
      }}
    >
      <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-950">
        <p className="text-5xl font-bold text-white">
          {safeScore}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          out of 100
        </p>
      </div>
    </div>
  );
}

function ResultStat({ title, value, subtitle }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {subtitle}
      </p>
    </article>
  );
}

function ScoreBadge({ score }) {
  const className =
    score >= 8
      ? "bg-emerald-50 text-emerald-700"
      : score >= 5
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`shrink-0 rounded-2xl px-4 py-2 text-lg font-bold ${className}`}
    >
      {score}/10
    </span>
  );
}

function AnswerPanel({ title, text, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-indigo-100 bg-indigo-50/50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function getPerformance(score) {
  const value = Number(score) || 0;

  if (value >= 85) {
    return { label: "Excellent performance" };
  }

  if (value >= 70) {
    return { label: "Strong performance" };
  }

  if (value >= 50) {
    return { label: "Developing performance" };
  }

  return { label: "Needs improvement" };
}

export default Result;