import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  BriefcaseBusiness,
  Clock3,
  FileQuestion,
  Gauge,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../components/layout/Navbar";
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

  const roles = [
    "MERN Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Java Developer",
    "Python Developer",
    "Data Analyst",
    "Frontend Developer",
    "Backend Developer",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  const interviewTypes = [
    "Technical",
    "HR",
    "Behavioral",
    "Mixed",
  ];

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

  const handleOptionSelect = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const createResponse = await api.post(
        "/interviews",
        formData
      );

      const interviewId =
        createResponse.data.interview._id;

      toast.success("Interview created");

      await api.post(
        `/interviews/${interviewId}/generate-questions`
      );

      toast.success("AI questions generated");

      navigate(`/interviews/${interviewId}`);
    } catch (requestError) {
      const message =
        requestError.response?.data?.error ||
        requestError.response?.data?.message ||
        "Unable to create interview";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <BrainCircuit size={27} />
              </span>

              <div>
                <h1 className="text-3xl font-bold text-slate-950">
                  Create AI interview
                </h1>

                <p className="mt-2 max-w-xl text-slate-500">
                  Configure your mock interview and let Gemini generate
                  role-specific questions.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              className="mt-8 space-y-8"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="role"
                  className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <BriefcaseBusiness size={17} />
                  Target role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Gauge size={17} />
                  Difficulty
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {difficulties.map((difficulty) => {
                    const active =
                      formData.difficulty === difficulty;

                    return (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() =>
                          handleOptionSelect(
                            "difficulty",
                            difficulty
                          )
                        }
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                        }`}
                      >
                        <p className="font-semibold">
                          {difficulty}
                        </p>

                        <p className="mt-1 text-xs opacity-70">
                          {difficulty === "Easy" &&
                            "Foundational concepts"}
                          {difficulty === "Medium" &&
                            "Practical understanding"}
                          {difficulty === "Hard" &&
                            "Advanced problem solving"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Sparkles size={17} />
                  Interview type
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {interviewTypes.map((type) => {
                    const active = formData.type === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          handleOptionSelect("type", type)
                        }
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                        }`}
                      >
                        <p className="font-semibold">{type}</p>

                        <p className="mt-1 text-xs opacity-70">
                          {type === "Technical" &&
                            "Role-specific technical questions"}
                          {type === "HR" &&
                            "General HR interview questions"}
                          {type === "Behavioral" &&
                            "Experience and situation-based questions"}
                          {type === "Mixed" &&
                            "Balanced technical and HR questions"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="questionCount"
                    className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <FileQuestion size={17} />
                    Questions
                  </label>

                  <select
                    id="questionCount"
                    name="questionCount"
                    value={formData.questionCount}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value={3}>3 questions</option>
                    <option value={5}>5 questions</option>
                    <option value={10}>10 questions</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <Clock3 size={17} />
                    Duration
                  </label>

                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles size={19} />

                {submitting
                  ? "Generating your interview..."
                  : "Generate AI interview"}
              </button>
            </form>
          </motion.section>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-950 p-7 text-white shadow-xl">
              <p className="text-sm font-semibold text-indigo-300">
                Interview preview
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {formData.role}
              </h2>

              <div className="mt-6 space-y-4">
                <PreviewItem
                  label="Difficulty"
                  value={formData.difficulty}
                />

                <PreviewItem
                  label="Interview type"
                  value={formData.type}
                />

                <PreviewItem
                  label="Questions"
                  value={`${formData.questionCount}`}
                />

                <PreviewItem
                  label="Duration"
                  value={`${formData.duration} minutes`}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-950">
                What happens next?
              </h3>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <Step
                  number="1"
                  text="PrexInter creates your interview session."
                />

                <Step
                  number="2"
                  text="Gemini generates customised questions."
                />

                <Step
                  number="3"
                  text="You answer one question at a time."
                />

                <Step
                  number="4"
                  text="AI evaluates and scores your responses."
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PreviewItem({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
        {number}
      </span>

      <p className="pt-1">{text}</p>
    </div>
  );
}

export default CreateInterview;