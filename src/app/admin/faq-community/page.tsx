"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getFaqTopicTitle } from "@/lib/faqTopics";

type QuestionStatus = "pending" | "approved" | "rejected";
type FilterStatus = QuestionStatus | "all";

type ModerationQuestion = {
  id: string;
  faq_topic_id: string;
  display_name: string | null;
  audience_type: string | null;
  question: string;
  answer: string | null;
  status: QuestionStatus;
  created_at: string;
  approved_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  moderation_note: string | null;
};

const filters: Array<{ label: string; value: FilterStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

const statusStyles: Record<QuestionStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-800 ring-rose-200",
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function FaqCommunityModerationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState<ModerationQuestion[]>([]);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [moderationNoteDrafts, setModerationNoteDrafts] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const counts = useMemo(
    () => ({
      pending: questions.filter((question) => question.status === "pending").length,
      approved: questions.filter((question) => question.status === "approved")
        .length,
      rejected: questions.filter((question) => question.status === "rejected")
        .length,
      total: questions.length,
    }),
    [questions],
  );

  const visibleQuestions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();

    return questions.filter((question) => {
      if (activeStatus !== "all" && question.status !== activeStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        question.question,
        question.answer,
        getFaqTopicTitle(question.faq_topic_id),
        question.display_name,
        question.audience_type,
      ].some((value) => value?.toLocaleLowerCase().includes(normalizedSearch));
    });
  }, [activeStatus, questions, searchQuery]);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "/api/admin/faq-community/questions?status=all",
        { cache: "no-store" },
      );

      if (response.status === 401) {
        setIsAuthenticated(false);
        setQuestions([]);
        return;
      }

      const data = (await response.json()) as {
        questions?: ModerationQuestion[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Questions could not be loaded.");
      }

      const nextQuestions = data.questions ?? [];
      setIsAuthenticated(true);
      setQuestions(nextQuestions);
      setAnswerDrafts(
        Object.fromEntries(
          nextQuestions.map((question) => [question.id, question.answer ?? ""]),
        ),
      );
      setModerationNoteDrafts(
        Object.fromEntries(
          nextQuestions.map((question) => [
            question.id,
            question.moderation_note ?? "",
          ]),
        ),
      );
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Questions could not be loaded right now.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadQuestions(), 0);
    return () => window.clearTimeout(timer);
  }, [loadQuestions]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/faq-community/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to enter the moderation panel.");
      }

      setPasscode("");
      setIsAuthenticated(true);
      await loadQuestions();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to enter the moderation panel.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/faq-community/logout", { method: "POST" });
    setIsAuthenticated(false);
    setQuestions([]);
    setMessage(null);
  }

  async function updateQuestion(
    questionId: string,
    changes: {
      status?: QuestionStatus;
      answer?: string;
      moderationNote?: string;
    },
    successMessage: string,
  ) {
    setUpdatingId(questionId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/faq-community/questions/${questionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        },
      );
      const data = (await response.json()) as { error?: string };

      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Your moderation session expired. Please sign in again.");
      }

      if (!response.ok) {
        throw new Error(data.error || "The question could not be updated.");
      }

      await loadQuestions();
      setMessage({ type: "success", text: successMessage });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "The question could not be updated.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-6 py-12">
        <section className="w-full max-w-md rounded-2xl border border-white/80 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-9">
          <div className="mb-7">
            <span className="inline-flex rounded-full bg-[#0F4C5C]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C5C]">
              Private school access
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              FAQ Moderation
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter the school moderation passcode to review community questions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Moderation passcode
              <input
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                required
                autoComplete="current-password"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15"
              />
            </label>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#146577] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? "Checking passcode…" : "Enter Moderation Panel"}
            </button>
          </form>

          {message && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              {message.text}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 text-slate-950 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F4C5C]">
              Private moderation
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              FAQ Community Questions
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review, answer, and publish community questions without changing the
              school’s official FAQ responses.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
          >
            Log out
          </button>
        </header>

        <aside className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-slate-700">
          <span className="font-semibold text-amber-900">Privacy reminder: </span>
          For authorized school personnel only. Review questions for accuracy,
          privacy, and appropriateness before approving. Do not publish learner
          names, LRN, grades, addresses, phone numbers, or private concerns.
        </aside>

        <section
          className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4"
          aria-label="Question counts"
        >
          {[
            { label: "Pending", value: counts.pending, accent: "text-amber-700" },
            {
              label: "Approved",
              value: counts.approved,
              accent: "text-emerald-700",
            },
            { label: "Rejected", value: counts.rejected, accent: "text-rose-700" },
            { label: "Total", value: counts.total, accent: "text-[#0F4C5C]" },
          ].map((count) => (
            <div
              key={count.label}
              className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {count.label}
              </p>
              <p className={`mt-2 text-3xl font-semibold tracking-tight ${count.accent}`}>
                {count.value}
              </p>
            </div>
          ))}
        </section>

        <label className="mt-5 block">
          <span className="sr-only">Search submitted questions</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search submitted questions..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15"
          />
        </label>

        <nav
          className="mt-7 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm"
          aria-label="Question status filters"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveStatus(filter.value)}
              aria-pressed={activeStatus === filter.value}
              className={`min-w-24 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeStatus === filter.value
                  ? "bg-[#0F4C5C] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </nav>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <section className="mt-6" aria-busy={isLoading}>
          {isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
              Loading questions…
            </div>
          ) : visibleQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
              <p className="font-semibold text-slate-800">
                {searchQuery.trim()
                  ? "No results match your search."
                  : activeStatus === "pending"
                    ? "No pending questions for review."
                    : activeStatus === "approved"
                      ? "No approved community questions yet."
                      : activeStatus === "rejected"
                        ? "No rejected community questions."
                        : "No community questions yet."}
              </p>
              {!searchQuery.trim() && (
                <p className="mt-1 text-sm text-slate-500">
                  New submissions will appear here after the list is refreshed.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-5">
              {visibleQuestions.map((question) => {
                const isUpdating = updatingId === question.id;
                const answer = answerDrafts[question.id] ?? "";
                const moderationNote = moderationNoteDrafts[question.id] ?? "";
                const topicTitle = getFaqTopicTitle(question.faq_topic_id);
                const submittedBy = [
                  question.display_name || "Anonymous",
                  question.audience_type,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={question.id}
                    className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] sm:p-7"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold leading-7 text-slate-950">
                          {question.question}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="font-medium text-[#0F4C5C]">
                            {topicTitle}
                          </span>
                          <span className="font-mono text-[11px]">
                            {question.faq_topic_id}
                          </span>
                          <span>{submittedBy}</span>
                          <time dateTime={question.created_at}>
                            {formatDate(question.created_at)}
                          </time>
                        </div>
                        {question.reviewed_at && (
                          <p className="mt-2 text-xs text-slate-500">
                            Reviewed {formatDate(question.reviewed_at)} by{" "}
                            {question.reviewed_by || "FAQ Admin"}
                          </p>
                        )}
                      </div>
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[question.status]}`}
                      >
                        {question.status}
                      </span>
                    </div>

                    <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
                      Official answer
                      <textarea
                        value={answer}
                        onChange={(event) =>
                          setAnswerDrafts((drafts) => ({
                            ...drafts,
                            [question.id]: event.target.value,
                          }))
                        }
                        rows={4}
                        maxLength={5000}
                        className="resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-normal leading-6 text-slate-950 outline-none transition focus:border-[#0F4C5C] focus:bg-white focus:ring-2 focus:ring-[#0F4C5C]/15"
                      />
                    </label>

                    <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
                      Internal moderation note
                      <textarea
                        value={moderationNote}
                        onChange={(event) =>
                          setModerationNoteDrafts((drafts) => ({
                            ...drafts,
                            [question.id]: event.target.value,
                          }))
                        }
                        rows={3}
                        maxLength={2000}
                        placeholder="Private note for school reviewers only"
                        className="resize-y rounded-xl border border-slate-300 bg-amber-50/40 px-4 py-3 font-normal leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0F4C5C] focus:bg-white focus:ring-2 focus:ring-[#0F4C5C]/15"
                      />
                      <span className="text-right text-xs font-normal text-slate-400">
                        {moderationNote.length}/2000 · Never shown publicly
                      </span>
                    </label>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          void updateQuestion(
                            question.id,
                            { status: "approved", answer, moderationNote },
                            "The question was approved and is now public.",
                          )
                        }
                        className="rounded-xl bg-[#0F4C5C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#146577] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          void updateQuestion(
                            question.id,
                            { answer, moderationNote },
                            "The answer and moderation note were saved.",
                          )
                        }
                        className="rounded-xl border border-[#0F4C5C]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4C5C] transition hover:bg-[#0F4C5C]/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Save Answer
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          void updateQuestion(
                            question.id,
                            { status: "rejected", answer, moderationNote },
                            "The question was rejected and remains private.",
                          )
                        }
                        className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          void updateQuestion(
                            question.id,
                            { status: "pending", answer, moderationNote },
                            "The question was returned to pending review.",
                          )
                        }
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating ? "Updating…" : "Set Pending"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
