import { isValidElement } from "react";
import { motion } from "framer-motion";

function StatCard({
  title,
  value = 0,
  subtitle,
  icon,
  trend,
  suffix = "",
}) {
  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    if (isValidElement(icon)) {
      return icon;
    }

    const IconComponent = icon;
    return <IconComponent size={24} />;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.25 }}
      className="app-card p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {value}
            {suffix}
          </p>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">
              {subtitle}
            </p>
          )}

          {trend && (
            <p className="mt-3 text-xs font-semibold text-emerald-600">
              {trend}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600">
            {renderIcon()}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default StatCard;