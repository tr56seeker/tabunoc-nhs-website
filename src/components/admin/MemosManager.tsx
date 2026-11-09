"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Archive, ExternalLink, FileText, LoaderCircle, Pencil, Upload } from "lucide-react";

import { memoCategories } from "@/data/memos";

type MemoRecord = {
  id: string;
  memo_number: string;
  title: string;
  date_issued: string;
  category: string;
  issuing_office: string;
  description: string;
  file_url: string;
  status: "draft" | "published" | "archived";
  created_at: string;
};

type EditForm = Pick<
  MemoRecord,
  "memo_number" | "title" | "date_issued" | "category" | "issuing_office" | "description" | "status"
>;

const categories = memoCategories.filter((category) => category !== "All");

function statusClass(status: MemoRecord["status"]) {
  if (status === "published") return "bg-emerald-100 text-emerald-800";
  if (status === "archived") return "bg-slate-200 text-slate-600";
  return "bg-amber-100 text-amber-800";
}

export default function MemosManager() {
  const [memos, setMemos] = useState<MemoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const loadMemos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/memos", { cache: "no-store" });
      const payload = (await response.json()) as { memos?: MemoRecord[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to load memos.");
      setMemos(payload.memos ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load memos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      void loadMemos();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [loadMemos]);

  const visibleMemos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return memos;
    return memos.filter((memo) =>
      [memo.memo_number, memo.title, memo.category, memo.issuing_office, memo.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [memos, search]);

  async function createMemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/admin/memos", { method: "POST", body: new FormData(form) });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to save memo.");
      form.reset();
      setMessage("Memo saved successfully.");
      await loadMemos();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save memo.");
    } finally {
      setSaving(false);
    }
  }

  function beginEdit(memo: MemoRecord) {
    setEditingId(memo.id);
    setEditForm({
      memo_number: memo.memo_number,
      title: memo.title,
      date_issued: memo.date_issued,
      category: memo.category,
      issuing_office: memo.issuing_office,
      description: memo.description,
      status: memo.status,
    });
    setMessage("");
    setError("");
  }

  async function saveEdit() {
    if (!editingId || !editForm) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/memos/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to update memo.");
      setEditingId(null);
      setEditForm(null);
      setMessage("Memo changes saved.");
      await loadMemos();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update memo.");
    } finally {
      setSaving(false);
    }
  }

  async function archiveMemo(memo: MemoRecord) {
    if (!window.confirm(`Archive ${memo.memo_number}? It will disappear from the public memo list.`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/memos/${memo.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to archive memo.");
      setMessage("Memo archived.");
      await loadMemos();
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : "Unable to archive memo.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-teal-100";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-brand-mint p-3 text-brand-teal"><Upload className="h-5 w-5" /></span>
          <div>
            <h2 className="text-xl font-semibold text-brand-navy">Upload an official memo</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">PDF only, up to 15 MB. Save as draft for review or publish it immediately.</p>
          </div>
        </div>

        <form onSubmit={createMemo} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Memo number<input name="memoNumber" required maxLength={100} className={`${inputClass} mt-2`} placeholder="e.g. School Memo No. 12, s. 2026" /></label>
          <label className="text-sm font-semibold text-slate-700">Date issued<input name="dateIssued" type="date" required className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">Title<input name="title" required maxLength={240} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">Category<select name="category" required defaultValue="School Memorandum" className={`${inputClass} mt-2`}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Issuing office<input name="issuingOffice" required maxLength={160} defaultValue="Office of the School Principal" className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">Short description<textarea name="description" maxLength={1500} rows={3} className={`${inputClass} mt-2 resize-y`} /></label>
          <label className="text-sm font-semibold text-slate-700">Official PDF<input name="file" type="file" required accept="application/pdf,.pdf" className={`${inputClass} mt-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-navy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white`} /></label>
          <label className="text-sm font-semibold text-slate-700">Publication status<select name="status" defaultValue="draft" className={`${inputClass} mt-2`}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <div className="md:col-span-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-teal disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Save memo</button></div>
        </form>
      </section>

      {(message || error) && <div role="status" className={`rounded-xl border px-4 py-3 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl font-semibold text-brand-navy">Memo library</h2><p className="mt-1 text-sm text-slate-600">Published records appear automatically on the public Memos page.</p></div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search managed memos" placeholder="Search memos..." className={`${inputClass} sm:max-w-xs`} />
        </div>

        {loading ? <p className="mt-6 flex items-center gap-2 text-sm text-slate-600"><LoaderCircle className="h-4 w-4 animate-spin" />Loading memos...</p> : visibleMemos.length === 0 ? <p className="mt-6 rounded-xl bg-slate-50 p-6 text-sm text-slate-600">No memo records found.</p> : <div className="mt-6 space-y-3">{visibleMemos.map((memo) => (
          <article key={memo.id} className="rounded-xl border border-slate-200 p-4">
            {editingId === memo.id && editForm ? (
              <div className="grid gap-3 md:grid-cols-2">
                <input aria-label="Memo number" value={editForm.memo_number} onChange={(e) => setEditForm({ ...editForm, memo_number: e.target.value })} className={inputClass} />
                <input aria-label="Date issued" type="date" value={editForm.date_issued} onChange={(e) => setEditForm({ ...editForm, date_issued: e.target.value })} className={inputClass} />
                <input aria-label="Memo title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={`${inputClass} md:col-span-2`} />
                <select aria-label="Memo category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
                <input aria-label="Issuing office" value={editForm.issuing_office} onChange={(e) => setEditForm({ ...editForm, issuing_office: e.target.value })} className={inputClass} />
                <textarea aria-label="Memo description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className={`${inputClass} md:col-span-2`} />
                <select aria-label="Memo status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as MemoRecord["status"] })} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select>
                <div className="flex gap-2 md:justify-end"><button type="button" onClick={() => { setEditingId(null); setEditForm(null); }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button><button type="button" onClick={saveEdit} disabled={saving} className="rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Save changes</button></div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-3"><FileText className="mt-1 h-5 w-5 shrink-0 text-brand-teal" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-brand-navy">{memo.memo_number}: {memo.title}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass(memo.status)}`}>{memo.status}</span></div><p className="mt-1 text-sm text-slate-600">{memo.category} · {memo.date_issued} · {memo.issuing_office}</p></div></div>
                <div className="flex shrink-0 flex-wrap gap-2"><a href={memo.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><ExternalLink className="h-4 w-4" />PDF</a><button type="button" onClick={() => beginEdit(memo)} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><Pencil className="h-4 w-4" />Edit</button>{memo.status !== "archived" && <button type="button" onClick={() => archiveMemo(memo)} className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"><Archive className="h-4 w-4" />Archive</button>}</div>
              </div>
            )}
          </article>
        ))}</div>}
      </section>
    </div>
  );
}
