"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseBrowser();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError || !data.session?.access_token) {
        throw new Error(signInError?.message || "Unable to sign in.");
      }

      const response = await fetch("/api/admin/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: data.session.access_token }),
      });

      if (!response.ok) {
        await supabase.auth.signOut();
        throw new Error("Your account is not authorized for admin access.");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <label className="block text-sm font-semibold text-slate-700">
        Email address
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none ring-[#0F4C5C]/20 transition focus:border-[#0F4C5C] focus:ring-4"
        />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none ring-[#0F4C5C]/20 transition focus:border-[#0F4C5C] focus:ring-4"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#146577] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in to Admin Dashboard"}
      </button>
    </form>
  );
}
