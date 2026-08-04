import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import SocialButton from "./SocialButton";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = response.data?.token;
      const userData = response.data?.user;

      if (!token || !userData) {
        throw new Error("Invalid login response from server.");
      }

      login(token, userData);

      toast.success("Welcome back to PrexInter");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Login failed. Please check your credentials.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-20 mx-auto w-full max-w-[480px] rounded-[28px] border border-violet-500/40 bg-[#090b16]/95 px-6 py-6 shadow-[0_24px_80px_rgba(76,29,149,0.30)] backdrop-blur-2xl sm:px-8 sm:py-7"
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-black shadow-lg shadow-violet-600/30">
          P
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight">
          Welcome back
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
          Log in to continue your interview preparation journey.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-slate-200"
        >
          Email address
        </label>

        <div className="relative mt-2">
          <Mail
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-200"
          >
            Password
          </label>

          <button
            type="button"
            className="text-sm font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative mt-2">
          <LockKeyhole
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={submitting ? undefined : { y: -2 }}
          whileTap={submitting ? undefined : { scale: 0.99 }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-3.5 font-bold text-white shadow-xl shadow-violet-950/40 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Logging in...
            </>
          ) : (
            <>
              Log in
              <ArrowRight size={19} />
            </>
          )}
        </motion.button>
      </form>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />

        <span className="text-sm text-slate-500">
          or continue with
        </span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SocialButton
          label="Google"
          icon={
            <span className="text-lg font-black text-blue-400">
              G
            </span>
          }
          onClick={() =>
            toast("Google login will be added later.")
          }
        />

        <SocialButton
          label="GitHub"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.17c-3.18.69-3.85-1.53-3.85-1.53-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.52-2.54-.29-5.22-1.27-5.22-5.66 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.36-5.25 5.65.41.35.77 1.04.77 2.09v3.1c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          }
          onClick={() =>
            toast("GitHub login will be added later.")
          }
        />
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-violet-400 transition hover:text-violet-300"
        >
          Register
        </Link>
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-500">
        <ShieldCheck size={15} />
        Your account and interview data are protected.
      </div>
    </motion.div>
  );
}

export default LoginForm;