import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleAnswerChange = (event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = event.target.value;

    setAnswers(updatedAnswers);
    setSavedMessage("");
  };

  const saveCurrentAnswer = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage("");

      await api.put(`/interviews/${id}/answer`, {
        questionIndex: currentQuestionIndex,
        answer: answers[currentQuestionIndex] || "",
      });

      setSavedMessage("Answer saved");
      return true;
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save answer"
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    const saved = await saveCurrentAnswer();

    if (
      saved &&
      currentQuestionIndex < interview.questions.length - 1
    ) {
      setCurrentQuestionIndex(
        (currentIndex) => currentIndex + 1
      );
      setSavedMessage("");
    }
  };

  const handlePrevious = async () => {
    const saved = await saveCurrentAnswer();

    if (saved && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (currentIndex) => currentIndex - 1
      );
      setSavedMessage("");
    }
  };

  const handleExit = async () => {
    await saveCurrentAnswer();
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
        <section className="rounded-2xl bg-white p-8 text-center">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white"
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
        <section className="rounded-2xl bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            No questions found
          </h1>

          <p className="mt-2 text-slate-600">
            Generate interview questions first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white"
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
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600">
              PrexInter
            </h1>

            <p className="mt-1 text-slate-500">
              {interview.role} · {interview.difficulty} ·{" "}
              {interview.type}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExit}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Exit interview
          </button>
        </header>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <p className="font-semibold text-indigo-600">
              Question {currentQuestionIndex + 1} of{" "}
              {interview.questions.length}
            </p>

            <p className="text-slate-500">
              {Math.round(progress)}% complete
            </p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section className="mt-8">
          <p className="text-sm font-medium text-slate-500">
            {currentQuestion.category || "General"}
          </p>

          <h2 className="mt-2 text-2xl font-bold leading-relaxed text-slate-900">
            {currentQuestion.question}
          </h2>

          <label
            htmlFor="answer"
            className="mt-7 block text-sm font-semibold text-slate-700"
          >
            Your answer
          </label>

          <textarea
            id="answer"
            value={answers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            placeholder="Write your answer here..."
            className="mt-2 min-h-64 w-full resize-none rounded-xl border border-slate-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <div className="mt-3 min-h-6">
            {saving && (
              <p className="text-sm text-slate-500">
                Saving answer...
              </p>
            )}

            {!saving && savedMessage && (
              <p className="text-sm font-medium text-emerald-600">
                {savedMessage}
              </p>
            )}

            {error && interview && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={
                currentQuestionIndex === 0 || saving
              }
              className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={saveCurrentAnswer}
              disabled={saving}
              className="rounded-lg border border-indigo-600 px-5 py-3 font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
            >
              Save answer
            </button>

            {currentQuestionIndex <
            interview.questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Next question
              </button>
            ) : (
              <button
                type="button"
                onClick={saveCurrentAnswer}
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Save final answer
              </button>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Interview;