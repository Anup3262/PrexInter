import {
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";

function FooterBar() {
  return (
    <div className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-8 whitespace-nowrap text-sm text-slate-400 xl:flex">
      <div className="flex items-center gap-2">
        <ShieldCheck size={17} className="text-violet-400" />
        Secure & Private
      </div>

      <span className="h-5 w-px bg-white/15" />

      <div className="flex items-center gap-2">
        <LockKeyhole size={17} className="text-violet-400" />
        Your data is protected
      </div>

      <span className="h-5 w-px bg-white/15" />

      <div className="flex items-center gap-2">
        <Users size={17} className="text-violet-400" />
        Trusted by learners worldwide
      </div>
    </div>
  );
}

export default FooterBar;