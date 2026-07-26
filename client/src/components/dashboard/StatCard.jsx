import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-950">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Icon size={22} />
          </span>
        )}
      </div>
    </motion.article>
  );
}

export default StatCard;