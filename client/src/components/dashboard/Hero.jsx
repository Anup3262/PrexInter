
import {
  ArrowRight,
  FileText,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-2xl"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-indigo-200">
            <Sparkles size={16} />
            AI-powered interview preparation
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Prepare with purpose.
            <span className="block text-indigo-400">
              Interview with confidence.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Generate role-specific interview questions, practise your
            answers, and receive detailed AI feedback with ideal answers.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/interviews/create")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Start new interview
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/resume-interview")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              <FileText size={18} />
              Resume interview
            </button>
          </div>
        </div>

        <div className="relative hidden min-h-64 lg:block">
          <div className="absolute right-0 top-1/2 w-full max-w-sm -translate-y-1/2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                AI mock interview
              </p>

              <h2 className="mt-3 text-xl font-bold">
                MERN Stack Developer
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Medium · Technical · 5 Questions
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-3/5 rounded-full bg-indigo-600" />
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Question 3 of 5
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Explain how JWT authentication works in a MERN
                  application.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 left-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs text-slate-300">
              Latest score
            </p>
            <p className="mt-1 text-2xl font-bold">86%</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Hero;