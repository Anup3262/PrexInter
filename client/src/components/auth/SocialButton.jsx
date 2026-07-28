function SocialButton({
  label,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 font-semibold text-slate-200 transition hover:border-violet-500/30 hover:bg-violet-500/10"
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}

export default SocialButton;