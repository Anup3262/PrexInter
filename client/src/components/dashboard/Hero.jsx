import {
  Award,
  CheckCircle2,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero({ stats = {} }) {
  const navigate = useNavigate();

  const {
    total = 0,
    completed = 0,
    averageScore = 0,
    bestScore = 0,
  } = stats;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-700 px-6 py-7 text-white shadow-2xl sm:px-8"
    >
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative grid items-center gap-7 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-indigo-100 backdrop-blur">
            <Sparkles size={16} />
            AI-powered interview preparation
          </span>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Practice today.
            <span className="block text-indigo-200">
              Perform tomorrow.
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Create role-specific interviews, practise your answers,
            and receive structured AI feedback and ideal responses.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/interviews/create")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              <Plus size={18} />
              Start AI interview
            </button>

            <button
              type="button"
              onClick={() => navigate("/resume-interview")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <FileText size={18} />
              Resume interview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl">
          <HeroMetric
            icon={Sparkles}
            value={total}
            label="Total interviews"
          />

          <HeroMetric
            icon={CheckCircle2}
            value={completed}
            label="Completed"
            rightBorder={false}
          />

          <HeroMetric
            icon={Award}
            value={`${averageScore}%`}
            label="Average score"
            bottomBorder={false}
          />

          <HeroMetric
            icon={Award}
            value={`${bestScore}%`}
            label="Best score"
            rightBorder={false}
            bottomBorder={false}
          />
        </div>
      </div>
    </motion.section>
  );
}

function HeroMetric({
  icon: Icon,
  value,
  label,
  rightBorder = true,
  bottomBorder = true,
}) {
  return (
    <div
      className={`p-5 ${
        rightBorder ? "border-r border-white/10" : ""
      } ${
        bottomBorder ? "border-b border-white/10" : ""
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-indigo-100">
        <Icon size={19} />
      </span>

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-indigo-100">
        {label}
      </p>
    </div>
  );
}

export default Hero;