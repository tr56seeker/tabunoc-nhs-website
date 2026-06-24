"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Status = "draft" | "published" | "archived";
type Highlight = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  alt_text: string | null;
  facebook_url: string | null;
  status: Status;
  display_order: number;
  event_date: string | null;
  created_at: string;
};

type Draft = {
  title: string;
  description: string;
  category: string;
  alt_text: string;
  facebook_url: string;
  display_order: string;
  event_date: string;
};

const fieldClass = "rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#24313e] focus:ring-2 focus:ring-[#24313e]/15";
const labelClass = "grid gap-1.5 text-sm font-semibold text-slate-700";
const statusStyles: Record<Status, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-rose-50 text-rose-700 ring-rose-200",
};

function makeDraft(highlight: Highlight): Draft {
  return {
    title: highlight.title,
    description: highlight.description ?? "",
    category: highlight.category ?? "",
    alt_text: highlight.alt_text ?? "",
    facebook_url: highlight.facebook_url ?? "",
    display_order: String(highlight.display_order),
    event_date: highlight.event_date ?? "",
  };
}

export default function HomeHighlightsAdminClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const loadHighlights = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/home-highlights", { cache: "no-store" });
      if (response.status === 401) {
        setAuthenticated(false);
        setHighlights([]);
        return;
      }
      const data = (await response.json()) as { highlights?: Highlight[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Highlights could not be loaded.");
      const next = data.highlights ?? [];
      setAuthenticated(true);
      setHighlights(next);
      setDrafts(Object.fromEntries(next.map((highlight) => [highlight.id, makeDraft(highlight)])));
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Highlights could not be loaded." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadHighlights(), 0);
    return () => window.clearTimeout(timer);
  }, [loadHighlights]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoggingIn(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/faq-community/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      setPasscode("");
      await loadHighlights();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Unable to sign in." });
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/faq-community/logout", { method: "POST" });
    setAuthenticated(false);
    setHighlights([]);
    setMessage(null);
  }

  async function createHighlight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const formData = new FormData(form);
    formData.set("status", submitter?.value === "published" ? "published" : "draft");
    setCreating(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/home-highlights", { method: "POST", body: formData });
      const data = (await response.json()) as { error?: string };
      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Your admin session expired. Please sign in again.");
      }
      if (!response.ok) throw new Error(data.error || "The highlight could not be saved.");
      form.reset();
      await loadHighlights();
      setMessage({ kind: "success", text: formData.get("status") === "published" ? "Highlight published." : "Draft saved." });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "The highlight could not be saved." });
    } finally {
      setCreating(false);
    }
  }

  function changeDraft(id: string, field: keyof Draft, value: string) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  }

  async function updateHighlight(highlight: Highlight, status?: Status, archive = false) {
    const draft = drafts[highlight.id];
    if (!draft) return;
    setUpdatingId(highlight.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/home-highlights/${highlight.id}`, {
        method: archive ? "DELETE" : "PATCH",
        headers: archive ? undefined : { "Content-Type": "application/json" },
        body: archive ? undefined : JSON.stringify({
          title: draft.title,
          description: draft.description,
          category: draft.category,
          alt_text: draft.alt_text,
          facebook_url: draft.facebook_url,
          display_order: Number(draft.display_order),
          event_date: draft.event_date || null,
          ...(status ? { status } : {}),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Your admin session expired. Please sign in again.");
      }
      if (!response.ok) throw new Error(data.error || "The highlight could not be updated.");
      await loadHighlights();
      setMessage({ kind: "success", text: archive ? "Highlight archived." : status === "published" ? "Highlight published." : status === "draft" ? "Highlight set to draft." : "Changes saved." });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "The highlight could not be updated." });
    } finally {
      setUpdatingId(null);
    }
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-6 py-12">
        <section className="w-full max-w-md rounded-2xl border border-white bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-9">
          <span className="inline-flex rounded-full bg-[#ffdf20] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#24313e]">Private school access</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#24313e]">Homepage Highlights</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Enter the school admin passcode to manage homepage photos.</p>
          <form onSubmit={login} className="mt-7 grid gap-4">
            <label className={labelClass}>Admin passcode<input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} required autoComplete="current-password" className={fieldClass} /></label>
            <button disabled={loggingIn} className="rounded-xl bg-[#24313e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#344657] disabled:opacity-60">{loggingIn ? "Checking passcode…" : "Enter Dashboard"}</button>
          </form>
          {message && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{message.text}</p>}
          {loading && <p className="mt-4 text-center text-xs text-slate-400">Checking your session…</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 text-slate-950 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F4C5C]">Homepage publishing</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24313e] sm:text-4xl">Homepage Highlights</h1><p className="mt-3 text-sm leading-6 text-slate-600">Upload, order, and publish the stories shown in School Highlights.</p></div>
          <button type="button" onClick={logout} className="self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400">Log out</button>
        </header>

        <aside className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-slate-700"><strong className="text-amber-900">For authorized school personnel only. </strong>Upload only photos cleared for official school publication. Avoid close-up learner photos, learner records, LRN, grades, addresses, private documents, or sensitive information.</aside>
        {message && <p role={message.kind === "error" ? "alert" : "status"} className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${message.kind === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{message.text}</p>}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="upload-title">
          <h2 id="upload-title" className="text-2xl font-semibold tracking-tight text-[#24313e]">Upload new highlight</h2>
          <form onSubmit={createHighlight} className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Photo <span className="text-xs font-normal text-slate-500">JPG, PNG, or WebP · max 5 MB</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" required className={`${fieldClass} file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:font-semibold`} /></label>
              <label className={labelClass}>Title <span className="text-xs font-normal text-slate-500">Maximum 120 characters</span><input name="title" required maxLength={120} className={fieldClass} /></label>
            </div>
            <label className={labelClass}>Description <span className="text-xs font-normal text-slate-500">Maximum 600 characters</span><textarea name="description" maxLength={600} rows={4} className={fieldClass} /></label>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <label className={labelClass}>Category<input name="category" maxLength={80} placeholder="e.g. Campus Life" className={fieldClass} /></label>
              <label className={labelClass}>Event date<input name="eventDate" type="date" className={fieldClass} /></label>
              <label className={labelClass}>Display order<input name="displayOrder" type="number" step="1" defaultValue="0" className={fieldClass} /></label>
              <label className={labelClass}>Status<input value="Choose with a button below" disabled className={`${fieldClass} bg-slate-50 text-slate-500`} /></label>
            </div>
            <label className={labelClass}>Alt text <span className="text-xs font-normal text-slate-500">Optional. Briefly describe what is visible; the title is used as a fallback.</span><input name="altText" maxLength={300} className={fieldClass} /></label>
            <label className={labelClass}>Facebook Post URL <span className="text-xs font-normal text-slate-500">Optional. Add the related official Facebook post link if available.</span><input name="facebookUrl" type="url" maxLength={500} placeholder="https://www.facebook.com/tabunocnatlhs/posts/..." className={fieldClass} /></label>
            <div className="flex flex-wrap gap-3"><button name="submitStatus" value="draft" disabled={creating} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#24313e] transition hover:bg-slate-50 disabled:opacity-60">Save as Draft</button><button name="submitStatus" value="published" disabled={creating} className="rounded-xl bg-[#ffdf20] px-5 py-3 text-sm font-semibold text-[#24313e] transition hover:bg-yellow-300 disabled:opacity-60">{creating ? "Saving…" : "Publish"}</button></div>
          </form>
        </section>

        <section className="mt-10" aria-labelledby="existing-title" aria-busy={loading}>
          <div className="flex items-end justify-between"><div><h2 id="existing-title" className="text-2xl font-semibold tracking-tight text-[#24313e]">Existing highlights</h2><p className="mt-1 text-sm text-slate-500">{highlights.length} total</p></div></div>
          <div className="mt-5 grid gap-5">
            {highlights.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-500">No highlights yet. Upload the first one above.</div> : highlights.map((highlight) => {
              const draft = drafts[highlight.id];
              if (!draft) return null;
              const busy = updatingId === highlight.id;
              return <article key={highlight.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid lg:grid-cols-[15rem_1fr]"><img src={highlight.image_url} alt={highlight.alt_text || highlight.title} className="h-56 w-full bg-slate-100 object-cover lg:h-full" /><div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[highlight.status]}`}>{highlight.status}</span><span className="text-xs text-slate-400">Added {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(highlight.created_at))}</span></div><div className="mt-5 grid gap-4"><label className={labelClass}>Title<input value={draft.title} maxLength={120} onChange={(event) => changeDraft(highlight.id, "title", event.target.value)} className={fieldClass} /></label><label className={labelClass}>Description<textarea value={draft.description} maxLength={600} rows={3} onChange={(event) => changeDraft(highlight.id, "description", event.target.value)} className={fieldClass} /></label><div className="grid gap-4 sm:grid-cols-3"><label className={labelClass}>Category<input value={draft.category} maxLength={80} onChange={(event) => changeDraft(highlight.id, "category", event.target.value)} className={fieldClass} /></label><label className={labelClass}>Event date<input type="date" value={draft.event_date} onChange={(event) => changeDraft(highlight.id, "event_date", event.target.value)} className={fieldClass} /></label><label className={labelClass}>Display order<input type="number" step="1" value={draft.display_order} onChange={(event) => changeDraft(highlight.id, "display_order", event.target.value)} className={fieldClass} /></label></div><label className={labelClass}>Alt text<input value={draft.alt_text} maxLength={300} onChange={(event) => changeDraft(highlight.id, "alt_text", event.target.value)} className={fieldClass} /></label><label className={labelClass}>Facebook Post URL <span className="text-xs font-normal text-slate-500">Optional. Add the related official Facebook post link if available.</span><input type="url" value={draft.facebook_url} maxLength={500} placeholder="https://www.facebook.com/tabunocnatlhs/posts/..." onChange={(event) => changeDraft(highlight.id, "facebook_url", event.target.value)} className={fieldClass} /></label></div><div className="mt-5 flex flex-wrap gap-2"><button disabled={busy} onClick={() => void updateHighlight(highlight)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Save Changes</button>{highlight.status !== "published" && <button disabled={busy} onClick={() => void updateHighlight(highlight, "published")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">Publish</button>}{highlight.status === "published" && <button disabled={busy} onClick={() => void updateHighlight(highlight, "draft")} className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">Unpublish / Set Draft</button>}{highlight.status !== "archived" && <button disabled={busy} onClick={() => void updateHighlight(highlight, undefined, true)} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">Archive</button>}</div></div></div></article>;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
