"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";

type FaqCommunityQuestionsProps = {
  faqTopicId: string;
  topicTitle: string;
};

type CommunityQuestion = {
  id: string;
  question: string;
  answer: string | null;
  created_at: string;
};

const audienceOptions = [
  "Learner",
  "Parent or Guardian",
  "Teacher",
  "Stakeholder",
  "Other",
];

function formatSubmittedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "Asia/Manila",
  }).format(date);
}

export default function FaqCommunityQuestions({
  faqTopicId,
  topicTitle,
}: FaqCommunityQuestionsProps) {
  const formId = useId();
  const containerRef = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [audienceType, setAudienceType] = useState("");
  const [question, setQuestion] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    const controller = new AbortController();

    async function loadQuestions() {
      try {
        const response = await fetch(
          `/api/faq/community-questions?faqTopicId=${encodeURIComponent(faqTopicId)}`,
          { cache: "no-store", signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load community questions.");
        }

        const data = (await response.json()) as {
          questions?: CommunityQuestion[];
        };
        setQuestions(data.questions ?? []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setLoadError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadQuestions();
    return () => controller.abort();
  }, [faqTopicId, shouldLoad]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/faq/community-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faqTopicId,
          displayName,
          audienceType,
          question,
          website,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "We could not submit your question.");
      }

      setDisplayName("");
      setAudienceType("");
      setQuestion("");
      setWebsite("");
      setMessage({
        type: "success",
        text: "Thank you. Your question was submitted for review.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "We could not submit your question. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      ref={containerRef}
      className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5"
      aria-labelledby={`${formId}-heading`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p
            id={`${formId}-heading`}
            className="text-sm font-semibold text-[#0F4C5C]"
          >
            Related Community Questions
          </p>
          {!isLoading && !loadError && questions.length > 0 && (
            <span className="rounded-full bg-[#0F4C5C]/10 px-2.5 py-1 text-xs font-semibold text-[#0F4C5C]">
              {questions.length} community {questions.length === 1 ? "question" : "questions"}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Questions shown here were reviewed before posting.
        </p>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3">
        {isLoading ? (
          <p className="text-sm text-slate-500" role="status">
            Loading approved questions…
          </p>
        ) : loadError ? (
          <p className="text-sm text-slate-500">
            Community questions are temporarily unavailable.
          </p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No approved community questions yet for this topic.
          </p>
        ) : (
          <div className="grid gap-3">
            {questions.map((communityQuestion) => (
              <article
                key={communityQuestion.id}
                className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_6px_18px_rgba(15,23,42,0.04)] sm:p-4"
              >
                <p className="font-medium leading-6 text-slate-900">
                  {communityQuestion.question}
                </p>
                {formatSubmittedDate(communityQuestion.created_at) && (
                  <time
                    dateTime={communityQuestion.created_at}
                    className="mt-1 block text-xs text-slate-400"
                  >
                    Submitted {formatSubmittedDate(communityQuestion.created_at)}
                  </time>
                )}
                {communityQuestion.answer?.trim() && (
                  <div className="mt-3 border-l-2 border-yellow-400 pl-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0F4C5C]">
                      School response
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {communityQuestion.answer}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setIsFormOpen((open) => !open);
          setMessage(null);
        }}
        aria-expanded={isFormOpen}
        aria-controls={`${formId}-form`}
        className="mt-4 w-full rounded-xl bg-[#0F4C5C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#146577] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] sm:w-auto sm:py-2.5"
      >
        {isFormOpen ? "Close question form" : "Ask a related question"}
      </button>

      {isFormOpen && (
        <form
          id={`${formId}-form`}
          onSubmit={handleSubmit}
          className="mt-5 border-t border-slate-200 pt-5"
        >
          <p className="text-sm font-semibold text-slate-900">
            Ask about “{topicTitle}”
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Name or initials <span className="font-normal text-slate-500">(optional)</span>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={80}
                autoComplete="name"
                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none transition focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              I am a
              <select
                value={audienceType}
                onChange={(event) => setAudienceType(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none transition focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15"
              >
                <option value="">Prefer not to say</option>
                {audienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 grid gap-1.5 text-sm font-medium text-slate-700">
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              required
              minLength={10}
              maxLength={500}
              rows={4}
              aria-describedby={`${formId}-question-help`}
              className="resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none transition focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15"
            />
            <span
              id={`${formId}-question-help`}
              className="text-right text-xs font-normal text-slate-500"
            >
              {question.length}/500
            </span>
          </label>

          <label
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            Website
            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
            <p>
              Please do not include learner names, LRN, grades, addresses, phone
              numbers, or private concerns. For personal or urgent matters,
              contact the school through official channels.
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Submitted questions are reviewed before posting. The school may
              edit questions for clarity, privacy, and appropriateness.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#0F4C5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#146577] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit for Review"}
            </button>
            {message && (
              <p
                role={message.type === "error" ? "alert" : "status"}
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
