import {
  BarChart3,
  Bot,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Bot,
    title: "AI Generated Questions",
    description:
      "Personalized questions based on your resume, skills, and target role.",
  },
  {
    icon: BarChart3,
    title: "Instant AI Feedback",
    description:
      "Receive detailed scores, ideal answers, and actionable improvement tips.",
  },
  {
    icon: Target,
    title: "Track and Improve",
    description:
      "Monitor your progress and build confidence before the real interview.",
  },
];

function MarketingPanel() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      className="relative hidden min-h-screen overflow-hidden border-r border-white/5 bg-[#070816] px-10 py-6 lg:flex lg:flex-col xl:px-14"
    >
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full border border-violet-500/20" />
      <div className="absolute -left-24 bottom-16 h-72 w-72 rounded-full border border-indigo-500/20" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-700/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-52 w-52 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-black shadow-lg shadow-violet-700/30">
          P
        </span>

        <div>
          <p className="text-2xl font-black tracking-tight text-white">
            Prex<span className="text-violet-400">Inter</span>
          </p>

          <p className="text-xs text-slate-500">
            AI Interview Preparation
          </p>
        </div>
      </div>

      <div className="relative z-10 my-auto max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-300">
          <Sparkles size={16} />
          Prepare smarter with AI
        </span>

        <h1 className="mt-6 text-5xl font-black leading-[1.08] tracking-tight text-white xl:text-6xl">
          AI-Powered Interviews.
          <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Smarter Preparation.
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-400">
          Practice realistic interviews, receive structured AI
          feedback, and improve your confidence before the real
          conversation.
        </p>

        <div className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + index * 0.1,
              }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        <div className="relative mt-10 hidden h-52 xl:block">
          <div className="absolute bottom-0 left-20 h-28 w-72 rounded-[50%] bg-violet-600/20 blur-2xl" />

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-4 left-32 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-violet-500 to-indigo-700 text-6xl font-black text-white shadow-2xl shadow-violet-700/40"
          >
            P
          </motion.div>

          <div className="absolute bottom-20 left-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 backdrop-blur">
            <BarChart3 className="text-violet-400" size={28} />
          </div>

          <div className="absolute bottom-28 left-64 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 backdrop-blur">
            <Target className="text-indigo-400" size={28} />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 text-sm text-slate-500">
        <ShieldCheck size={17} className="text-violet-400" />
        Secure, private, and built for consistent practice.
      </div>
    </motion.section>
  );
}


export default MarketingPanel;