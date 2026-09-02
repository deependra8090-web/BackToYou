import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "../../schema/signup.schema.js";
import { useSignup } from "../../hooks/useSignup.hook.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";

const BackToYouLogo = () => (
  <svg width="36" height="36" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" fill="url(#lg_signup)" />
    <path d="M9 14 C9 10.5 11.5 8 15 8 C18.5 8 21 10.5 21 14" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M6.5 11.5 L9 14 L11.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="14" cy="19" r="2.5" fill="white" />
    <defs>
      <linearGradient id="lg_signup" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Signup() {
  const { mutate, isPending, isError, error, isSuccess } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  function onSubmit(values) {
    mutate(values);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account created successfully! Redirecting to login…");
      form.reset();
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, form]);

  useEffect(() => {
    if (isError) {
      const msg = error?.message || "User may already exist or signup failed. Please try again.";
      toast.error(msg);
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
            Join BackToYou
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-xs">
            Create an account to report, track, and recover items across campus.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="First"
                  {...form.register("firstname")}
                  className="w-full rounded-2xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition bg-gray-50/50"
                />
              </div>
              {form.formState.errors.firstname && (
                <p className="text-red-500 text-[11px] mt-1">
                  {form.formState.errors.firstname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last"
                {...form.register("lastname")}
                className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition bg-gray-50/50"
              />
              {form.formState.errors.lastname && (
                <p className="text-red-500 text-[11px] mt-1">
                  {form.formState.errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Campus Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="student@campus.edu"
                autoComplete="email"
                {...form.register("email")}
                className="w-full rounded-2xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition bg-gray-50/50"
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
                placeholder="Min 6 characters with special char"
                autoComplete="new-password"
                {...form.register("password")}
                className="w-full rounded-2xl border border-gray-200 pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition bg-gray-50/50"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-95 transition shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <span>{isPending ? "Creating Account…" : "Create Campus Account"}</span>
            {!isPending && <ArrowRight size={16} />}
          </button>

          {/* Footer */}
          <div className="pt-4 text-center text-xs text-gray-500 border-t border-gray-100">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Toaster />
    </section>
  );
}