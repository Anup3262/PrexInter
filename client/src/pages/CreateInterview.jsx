import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function CreateInterview() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "MERN Stack Developer",
    difficulty: "Medium",
    type: "Technical",
    questionCount: 5,
    duration: 20,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        name === "questionCount" || name === "duration"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const createResponse = await api.post(
        "/interviews",
        formData
      );

      const interviewId =
        createResponse.data.interview._id;

      await api.post(
        `/interviews/${interviewId}/generate-questions`
      );

      navigate(`/interviews/${interviewId}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Unable to create interview"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm font-semibold text-indigo-600"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Create interview
        </h1>

        <p className="mt-2 text-slate-500">
          Configure your AI-powered mock interview.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Job role
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option>MERN Stack Developer</option>
              <option>React Developer</option>
              <option>Node.js Developer</option>
              <option>Java Developer</option>
              <option>Python Developer</option>
              <option>Data Analyst</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="difficulty"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Difficulty
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Interview type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option>Technical</option>
                <option>HR</option>
                <option>Behavioral</option>
                <option>Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="questionCount"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Number of questions
              </label>

              <select
                id="questionCount"
                name="questionCount"
                value={formData.questionCount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Duration
              </label>

              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value={10}>10 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Generating interview..."
              : "Create and generate questions"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateInterview;