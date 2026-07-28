function FloatingAvatar({
  initials,
  className,
}) {
  return (
    <div
      className={`absolute flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white shadow-2xl ${className}`}
    >
      {initials}
    </div>
  );
}

export default FloatingAvatar;