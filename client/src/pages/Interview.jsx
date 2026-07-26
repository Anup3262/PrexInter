import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LogOut,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../services/api";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(0);

  const autosaveTimerRef = useRef(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);
        const interviewData = response.data.interview;

        setInterview(interviewData);

        setAnswers(
          interviewData.questions.map(
            (question) => question.answer || ""
          )
        );

        setSecondsLeft((interviewData.duration || 20) * 60);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load interview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const saveAnswerByIndex = async (
    questionIndex,
    answer,
    showToast = false
  ) => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage("");

      await api.put(`/interviews/${id}/answer`, {
        questionIndex,
        answer: answer || "",
      });

      setSavedMessage("Saved");

      if (showToast) {
        toast.success("Answer saved");
      }

      return true;
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to save answer";

      setError(message);

      if (showToast) {
        toast.error(message);
      }

      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveCurrentAnswer = async (showToast = false) => {
    return saveAnswerByIndex(
      currentQuestionIndex,
      answers[currentQuestionIndex] || "",
      showToast
    );
  };

  useEffect(() => {
    if (!interview || loading) {
      return;
    }

    clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      saveCurrentAnswer(false);
    }, 1500);

    return () => {
      clearTimeout(autosaveTimerRef.current);
    };
  }, [answers, currentQuestionIndex, interview, loading]);

  const handleSubmitInterview = async () => {
    if (submittedRef.current || evaluating) {
      return;
    }

    try {
      submittedRef.current = true;
      setEvaluating(true);
      setError("");

      const saved = await saveCurrentAnswer(false);

      if (!saved) {
        submittedRef.current = false;
        return;
      }

      toast.loading("Evaluating your interview...", {
        id: "evaluation",
      });

      await api.post(`/interviews/${id}/evaluate`);

      toast.success("Interview evaluated", {
        id: "evaluation",
      });

      navigate(`/result/${id}`);
    } catch (requestError) {
      submittedRef.current = false;

      const message =
        requestError.response?.data?.error ||
        requestError.response?.data?.message ||
        "Unable to submit interview";

      setError(message);

      toast.error(message, {
        id: "evaluation",
      });
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    if (!interview || loading || evaluating) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);

          if (!submittedRef.current) {
            handleSubmitInterview();
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interview, loading, evaluating]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [secondsLeft]);

  const handleAnswerChange = (event) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestionIndex] =
      event.target.value;

    setAnswers(updatedAnswers);
    setSavedMessage("");
  };

  const handleNext = async () => {
    const saved = await saveCurrentAnswer(false);

    if (
      saved &&
      currentQuestionIndex <
        interview.questions.length - 1
    ) {
      setCurrentQuestionIndex((current) => current + 1);
      setSavedMessage("");
    }
  };

  const handlePrevious = async () => {
    const saved = await saveCurrentAnswer(false);

    if (saved && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((current) => current - 1);
      setSavedMessage("");
    }
  };

  const handleExit = async () => {
    await saveCurrentAnswer(false);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading interview...
      </main>
    );
  }

  if (error && !interview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <section className="rounded-3xl bg-white p-8 text-center">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  if (!interview?.questions?.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <section className="rounded-3xl bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-950">
            No questions found
          </h1>

          <p className="mt-2 text-slate-600">
            Generate interview questions first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  const currentQuestion =
    interview.questions[currentQuestionIndex];

  const progress =
    ((currentQuestionIndex + 1) /
      interview.questions.length) *
    100;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <Sparkles size={21} />
            </span>

            <div>
              <h1 className="text-xl font-bold">
                PrexInter
              </h1>

              <p className="text-sm text-slate-400">
                {interview.role} · {interview.difficulty} ·{" "}
                {interview.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
                secondsLeft <= 60
                  ? "border-red-400/30 bg-red-500/10 text-red-300"
                  : "border-white/10 bg-white/5 text-slate-200"
              }`}
            >
              <Clock3 size={17} />
              {formattedTime}
            </div>

            <button
              type="button"
              onClick={handleExit}
              disabled={saving || evaluating}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              <LogOut size={16} />
              Exit
            </button>
          </div>
        </header>

        <motion.section
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl bg-white p-6 shadow-2xl md:p-10"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Question {currentQuestionIndex + 1} of{" "}
                {interview.questions.length}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {currentQuestion.category || "General"}
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {Math.round(progress)}% complete
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2 className="mt-8 max-w-4xl text-2xl font-bold leading-relaxed text-slate-950 md:text-3xl">
            {currentQuestion.question}
          </h2>

          <label
            htmlFor="answer"
            className="mt-8 block text-sm font-semibold text-slate-700"
          >
            Your answer
          </label>

          <textarea
            id="answer"
            value={answers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            placeholder="Explain your answer clearly and include examples where relevant..."
            className="mt-3 min-h-72 w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 p-5 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          <div className="mt-4 flex min-h-6 items-center gap-2 text-sm">
            {saving && (
              <>
                <Save size={16} className="text-slate-400" />
                <span className="text-slate-500">
                  Saving...
                </span>
              </>
            )}

            {!saving && savedMessage && (
              <>
                <CheckCircle2
                  size={16}
                  className="text-emerald-600"
                />
                <span className="font-medium text-emerald-600">
                  {savedMessage}
                </span>
              </>
            )}

            {error && (
              <span className="text-red-600">{error}</span>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={
                currentQuestionIndex === 0 ||
                saving ||
                evaluating
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            <button
              type="button"
              onClick={() => saveCurrentAnswer(true)}
              disabled={saving || evaluating}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-600 px-5 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
            >
              <Save size={18} />
              Save answer
            </button>

            {currentQuestionIndex <
            interview.questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={saving || evaluating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
              >
                Next question
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitInterview}
                disabled={saving || evaluating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send size={18} />

                {evaluating
                  ? "Evaluating..."
                  : "Submit interview"}
              </button>
            )}
          </div>
        </motion.section>
      </section>
    </main>
  );
}

export default Interview;