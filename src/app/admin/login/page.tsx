import type { Metadata } from "next";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Tabunoc National High School",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] px-4 py-12 text-slate-950 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,35,36,0.14)] lg:grid-cols-[1fr_440px]">
          <div className="bg-[#24313e] p-8 text-white sm:p-10">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffdf20]">
              Tabunoc NHS Admin
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Unified school website dashboard
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
              Authorized school personnel can manage homepage highlights, FAQ
              content, community questions, and evacuation map calibration.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[#24313e]">
              Sign in
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the Supabase Auth account assigned to your admin profile.
            </p>
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
