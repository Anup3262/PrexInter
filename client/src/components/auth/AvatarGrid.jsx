const avatars = [
  { initials: "AK", className: "left-[2%] top-[3%]" },
  { initials: "RM", className: "left-[26%] top-[1%]" },
  { initials: "JS", className: "right-[24%] top-[4%]" },
  { initials: "NK", className: "right-[2%] top-[8%]" },
  { initials: "PS", className: "left-[6%] top-[28%]" },
  { initials: "AV", className: "right-[5%] top-[30%]" },
  { initials: "SK", className: "left-[1%] top-[55%]" },
  { initials: "AR", className: "right-[1%] top-[56%]" },
  { initials: "DK", className: "left-[8%] bottom-[7%]" },
  { initials: "VT", className: "right-[7%] bottom-[5%]" },
];

function AvatarGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {avatars.map((avatar, index) => (
        <div
          key={`${avatar.initials}-${index}`}
          className={`absolute flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-slate-700 to-slate-950 text-base font-bold text-slate-300 opacity-35 shadow-xl blur-[0.2px] ${avatar.className}`}
        >
          {avatar.initials}
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#050716] to-transparent" />
    </div>
  );
}

export default AvatarGrid;