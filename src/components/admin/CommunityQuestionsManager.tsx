"use client";

import { useEffect, useMemo, useState } from "react";

import { getFaqTopicTitle } from "@/lib/faqTopics";

type Status = "pending" | "approved" | "rejected";

type CommunityQuestion = {
  id: string;
  faq_topic_id: string;
  display_name: string | null;
  audience_type: string | null;
  question: string;
  answer: string | null;
  status: Status;
  created_at: string | null;
  approved_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  moderation_note: string | null;
};

const statuses: Array<Status | "all"> = ["pending", "approved", "rejected", "all"];

export default function CommunityQuestionsManager() {
  const [items, setItems] = useState<CommunityQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function load(nextStatus = status) {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/faq-community/questions?status=${encodeURIComponent(nextStatus)}`,
        { cache: "no-store" }
      );
      const data = (await response.json()) as {
        questions?: CommunityQuestion[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Questions could not be loaded.");
      }

      const questions = data.questions ?? [];
      setItems(questions);
      setAnswers(
        Object.fromEntries(questions.map((item) => [item.id, item.answer ?? ""]))
      );
      setNotes(
        Object.fromEntries(
          questions.map((item) => [item.id, item.moderation_note ?? ""])
        )
      );
    } catch (error) {
      setMessage({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "Questions could not be loaded.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function save(item: CommunityQuestion, nextStatus?: Status) {
    setSavingId(item.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/faq-community/questions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answers[item.id] ?? "",
          moderationNote: notes[item.id] ?? "",
          ...(nextStatus ? { status: nextStatus } : {}),
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The question could not be updated.");
      }

      await load(status);
      setMessage({
        kind: "success",
        text: nextStatus
          ? `Question ${nextStatus}.`
          : "Question response saved.",
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "The question could not be updated.",
      });
    } finally {
      setSavingId(null);
    }
  }

  const countLabel = useMemo(() => {
    if (loading) return "Loading questions...";
    return `${items.length} ${items.length === 1 ? "question" : "questions"}`;
  }, [items.length, loading]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#24313e]">
              FAQ Community Questions
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review submitted FAQ questions, add official answers, and publish
              approved responses on the public FAQ page.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {countLabel}
            </p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
                  status === item
                    ? "bg-[#0F4C5C] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.kind === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-teal-200 bg-teal-50 text-[#0F4C5C]"
          }`}
        >
          {message.text}
        </div>
      )}

      {!loading && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-500">
          No community questions found for this filter.
        </div>
      ) : (
        items.map((item) => {
          const busy = savingId === item.id;

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {getFaqTopicTitle(item.faq_topic_id)} - {item.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#24313e]">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Submitted by {item.display_name || "Anonymous"}
                    {item.audience_type ? ` - ${item.audience_type}` : ""}
                    {item.created_at
                      ? ` - ${new Intl.DateTimeFormat("en-PH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item.created_at))}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                    item.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "rejected"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Official answer
                <textarea
                  value={answers[item.id] ?? ""}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
                />
              </label>

              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Moderation note
                <textarea
                  value={notes[item.id] ?? ""}
                  onChange={(event) =>
                    setNotes((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  rows={2}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C5C]"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save(item)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                >
                  Save Response
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save(item, "approved")}
                  className="rounded-xl bg-[#0F4C5C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Approve and Publish
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save(item, "rejected")}
                  className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
