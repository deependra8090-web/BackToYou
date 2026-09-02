import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schema/login.schema.js";
import { useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin.hook.js";
import { useNavigate, Link } from "react-router";
import { toast, Toaster } from "sonner";
import Cookies from "js-cookie";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const BackToYouLogo = () => (
  <svg width="36" height="36" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" fill="url(#lg_login)" />
    <path d="M9 14 C9 10.5 11.5 8 15 8 C18.5 8 21 10.5 21 14" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M6.5 11.5 L9 14 L11.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="14" cy="19" r="2.5" fill="white" />
    <defs>
      <linearGradient id="lg_login" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Login() {
  const { mutate, isPending, isError, error, isSuccess } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    mutate(values);
  }

  const fillCredentials = (email, password) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

  useEffect(() => {
    if (isSuccess) {
      try {
        const userCookie = Cookies.get("user");
        if (userCookie) {
          const user = JSON.parse(userCookie);
          toast.success(`Welcome back, ${user.firstname || "User"}!`);
          if (user?.role === "admin" || user?.role === "superadmin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        navigate("/dashboard");
      }
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const message = error?.message || "Invalid email or password. Please try again.";
      toast.error(message);
    }
  }, [isError, error]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10">
        
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Link to="/" className="inline-block mb-3 hover:scale-105 transition-transform">
            <BackToYouLogo />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
            Welcome to BackToYou
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-xs">
            The smart AI-powered lost and found platform for your campus.
          </p>
        </div>

        {/* Demo Pill Buttons */}
        <div className="mb-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-2">
            <Sparkles size={14} /> Quick Demo Logins:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("admin@campus.edu", "Admin@1234")}
              className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 shadow-2xs transition"
            >
              🛡 Admin Account
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("deependra@campus.edu", "Password@123")}
              className="px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 shadow-2xs transition"
            >
              👤 Student Account
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Campus Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="name@campus.edu"
                autoComplete="username"
                {...form.register("email")}
                className="w-full rounded-2xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition bg-gray-50/50"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...form.register("password")}
                className="w-full rounded-2xl border border-gray-200 pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition bg-gray-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-95 transition shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <span>{isPending ? "Signing In…" : "Sign In to Campus"}</span>
            {!isPending && <ArrowRight size={16} />}
          </button>

          {/* Footer */}
          <div className="pt-4 text-center text-xs text-gray-500 border-t border-gray-100">
            <p>
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Toaster />
    </section>
  );
}