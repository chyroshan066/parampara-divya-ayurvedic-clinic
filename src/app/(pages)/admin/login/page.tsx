"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DBEFFA] px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="flex flex-col items-center gap-y-2 mb-8">
          <img
            style={{ height: "48px", width: "auto", objectFit: "contain" }}
            src="/images/logo.webp"
            alt="Om Kapan Dental"
          />
          <h1 className="text-slate-800 text-2xl font-bold mt-2">
            Admin Login
          </h1>
          <p className="text-slate-800/60 text-sm text-center">
            Sign in to manage Parampara Divya Ayurvedic
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-2">
            <label
              className="font-bold text-[13px] text-slate-600/90"
              htmlFor="email"
            >
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="form-input"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label
              className="font-bold text-[13px] text-slate-600/90"
              htmlFor="password"
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                className="form-input w-full pr-12"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute right-4 bottom-4 flex items-center justify-center text-slate-400 transition-colors hover:text-primary"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {isPasswordVisible ? (
                  <EyeSlash className="w-5 h-5" weight="bold" />
                ) : (
                  <Eye className="w-5 h-5" weight="bold" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full bg-primary text-white text-sm font-bold text-center leading-[3rem] rounded-xl transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}