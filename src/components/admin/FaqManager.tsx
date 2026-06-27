"use client";

import { useEffect, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_published: boolean;
};

const emptyFaq = {
  question: "",
  answer: "",
  category: "",
  is_published: true,
};

export default function FaqManager() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [form, setForm] = useState(emptyFaq);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/faq-items", { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as { items: FaqItem[] };
      setItems(data.items);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(
      editingId ? `/api/admin/faq-items/${editingId}` : "/api/admin/faq-items",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setMessage(response.ok ? "FAQ saved." : "Unable to save FAQ.");
    if (response.ok) {
      setForm(emptyFaq);
      setEditingId(null);
      await load();
    }
  }

  function edit(item: FaqItem) {
    setEditingId(item.id);
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category ?? "",
      is_published: item.is_published,
    });
  }

  const grouped = items.reduce<Record<string, FaqItem[]>>((groups, item) => {
    const category = item.category || "Uncategorized";
    groups[category] = [...(groups[category] ?? []), item];
    return groups;
  }, {});

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#24313e]">
          {editingId ? "Edit FAQ" : "Create FAQ"}
        </h2>
        <div className="mt-5 space-y-4">
          <Field label="Question" value={form.question} onChange={(value) => setForm((current) => ({ ...current, question: value }))} required />
          <label className="block text-sm font-semibold text-slate-700">
            Answer
            <textarea className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]" value={form.answer} onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))} rows={5} required />
          </label>
          <Field label="Category" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.is_published} onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))} />
            Published
          </label>
        </div>
        <button className="mt-5 rounded-xl bg-[#0F4C5C] px-4 py-2 text-sm font-semibold text-white">
          Save FAQ
        </button>
        {message && <p className="mt-4 text-sm text-[#0F4C5C]">{message}</p>}
      </form>

      <div className="space-y-5">
        {Object.entries(grouped).map(([category, groupItems]) => (
          <section key={category} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#24313e]">{category}</h2>
            <div className="mt-4 space-y-3">
              {groupItems.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-[#24313e]">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">
                        {item.is_published ? "Published" : "Unpublished"}
                      </p>
                    </div>
                    <button onClick={() => edit(item)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">
                      Edit
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
      />
    </label>
  );
}
