/**
 * FILE_ID: TABUNOC_LEARNER_POPULATION_PAGE
 * PATH: src/app/learner-population/page.tsx
 * PURPOSE: Public aggregate learner population page for Tabunoc National High School.
 */

import fs from "fs";
import path from "path";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";
import PopulationCountUp from "@/components/PopulationCountUp";

type PopulationRow = {
  sortOrder: number;
  schoolYear: string;
  lastUpdated: string;
  category: string;
  level: string;
  grades: string;
  count: number;
  note: string;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function readPopulationRows(): PopulationRow[] {
  const csvPath = path.join(
    process.cwd(),
    "public",
    "data",
    "learner-population-summary.csv"
  );
  const csv = fs.readFileSync(csvPath, "utf8").trim();
  const [headerLine, ...lines] = csv.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines
    .map((line) => {
      const values = parseCsvLine(line);
      const record = headers.reduce<Record<string, string>>(
        (row, header, index) => {
          row[header] = values[index] ?? "";
          return row;
        },
        {}
      );

      return {
        sortOrder: Number(record.sortOrder),
        schoolYear: record.schoolYear,
        lastUpdated: record.lastUpdated,
        category: record.category,
        level: record.level,
        grades: record.grades,
        count: Number(record.count),
        note: record.note,
      };
    })
    .sort((first, second) => first.sortOrder - second.sortOrder);
}

function formatCount(count: number) {
  return new Intl.NumberFormat("en-PH").format(count);
}

function isMainPopulationNumber(category: string) {
  return [
    "Junior High School",
    "Senior High School",
    "Total Learners",
    "Total Learner Population",
  ].includes(category);
}

function getPopulationAnimationDelay(category: string) {
  if (category === "Junior High School") {
    return 300;
  }

  if (category === "Senior High School") {
    return 600;
  }

  return 0;
}

function formatPercentage(count: number, total: number) {
  if (!Number.isFinite(count) || !Number.isFinite(total) || total <= 0) {
    return null;
  }

  return `${((count / total) * 100).toFixed(1)}%`;
}

function PopulationCardIcon({
  type,
}: {
  type: "total" | "junior" | "senior";
}) {
  const iconClassName = "h-6 w-6";

  if (type === "total") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-2-11.96a4 4 0 0 1 0 7.75"
        />
      </svg>
    );
  }

  if (type === "junior") {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={iconClassName}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2 9 10-5 10 5-10 5L2 9Zm4 2.5V16c3.5 2.67 8.5 2.67 12 0v-4.5M22 9v6"
      />
    </svg>
  );
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatSchoolYear(schoolYear: string) {
  const yearRange = schoolYear
    .replace(/^(SY|School Year)\s*/i, "")
    .replace(/(\d{4})-(\d{4})/, "$1–$2");

  return `School Year ${yearRange}`;
}

export default function LearnerPopulationPage() {
  const populationData = readPopulationRows();
  const schoolYear = populationData[0]?.schoolYear ?? "";
  const lastUpdated = populationData[0]?.lastUpdated ?? "";
  const totalRow =
    populationData.find((item) => item.category === "Total Learners") ??
    populationData[0];
  const juniorHighRow = populationData.find(
    (item) => item.category === "Junior High School"
  );
  const seniorHighRow = populationData.find(
    (item) => item.category === "Senior High School"
  );
  const juniorHighPercentage = juniorHighRow
    ? formatPercentage(juniorHighRow.count, totalRow.count)
    : null;
  const seniorHighPercentage = seniorHighRow
    ? formatPercentage(seniorHighRow.count, totalRow.count)
    : null;

  const programRows = populationData.filter(
    (item) => item.category !== "Total Learners"
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] text-[#24313E]">
        <section className="px-6 pb-10 pt-28 md:pt-32">
          <div className="mx-auto max-w-6xl">
            <BrandHeader compact />

            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex border-l-4 border-[#ffdf20] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#24313E] shadow-sm">
                {schoolYear}
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#24313E] md:text-6xl">
                Learner Population
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600 md:text-lg">
                Official learner population statistics of Tabunoc National High
                School for {formatSchoolYear(schoolYear)}.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <div
              id="population-counts"
              className="grid gap-4 lg:grid-cols-[1.2fr_1fr]"
            >
              {totalRow ? (
                <div
                  key={totalRow.category}
                  className="border border-[#ffdf20] bg-white p-7 shadow-sm md:p-8"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#ffdf20] text-[#24313E]">
                        <PopulationCardIcon type="total" />
                      </span>

                      <p className="text-base font-black uppercase tracking-[0.14em] text-[#24313E]">
                        Total Learners
                      </p>
                    </div>

                  </div>

                  <PopulationCountUp
                    value={totalRow.count}
                    delayMs={0}
                    triggerId="population-counts"
                    className="mt-7 block text-[4.5rem] font-black leading-none tracking-tight text-[#24313E] md:text-[5.4rem]"
                  />

                  {lastUpdated ? (
                    <p className="mt-4 text-sm font-bold text-slate-500">
                      As of {formatDate(lastUpdated)}
                    </p>
                  ) : null}

                </div>

              ) : null}

              <div className="grid gap-4">
                {programRows.map((item) => {
                  const percentage = formatPercentage(
                    item.count,
                    totalRow?.count ?? 0
                  );
                  const isJuniorHigh =
                    item.category === "Junior High School";
                  const isSeniorHigh =
                    item.category === "Senior High School";

                  return (
                    <div
                      key={item.category}
                      className="border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {isJuniorHigh || isSeniorHigh ? (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-[#24313E]">
                            <PopulationCardIcon
                              type={isJuniorHigh ? "junior" : "senior"}
                            />
                          </span>
                        ) : null}

                        <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-600">
                          {item.category}
                        </p>
                      </div>

                      <p className="mt-3 text-sm font-bold text-slate-500">
                        {item.grades}
                      </p>

                      {isMainPopulationNumber(item.category) ? (
                        <>
                          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                            <div className="flex items-baseline gap-2">
                              <PopulationCountUp
                                value={item.count}
                                delayMs={getPopulationAnimationDelay(
                                  item.category
                                )}
                                triggerId="population-counts"
                                className="block text-5xl font-black tracking-tight text-[#24313E]"
                              />
                              <span className="text-sm font-bold text-slate-500">
                                learners
                              </span>
                            </div>

                            {percentage ? (
                              <p className="text-sm font-black text-slate-600">
                                {percentage}
                                <span className="ml-1 font-semibold text-slate-400">
                                  of total
                                </span>
                              </p>
                            ) : null}
                          </div>

                          {percentage ? (
                            <div
                              aria-label={`${item.category}: ${percentage} of total learners`}
                              aria-valuemax={100}
                              aria-valuemin={0}
                              aria-valuenow={Number.parseFloat(percentage)}
                              className="mt-4 h-2 overflow-hidden bg-slate-100"
                              role="progressbar"
                            >
                              <div
                                className={`h-full ${
                                  isJuniorHigh
                                    ? "bg-[#ffdf20]"
                                    : "bg-slate-400"
                                }`}
                                style={{ width: percentage }}
                              />
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <p className="mt-5 text-5xl font-black tracking-tight text-[#24313E]">
                          {formatCount(item.count)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <section className="mt-8 border-t-4 border-[#ffdf20] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-black text-[#24313E]">
                Population Summary
              </h2>

              <div className="mt-3 max-w-4xl space-y-3 text-sm font-semibold leading-7 text-slate-600 md:text-base">
                {juniorHighPercentage && seniorHighPercentage ? (
                  <p>
                    Junior High School accounts for {juniorHighPercentage} of
                    total enrollment while Senior High School represents{" "}
                    {seniorHighPercentage}.
                  </p>
                ) : null}
                <p>
                  Figures are based on official school enrollment records and
                  may be updated following validation and reporting activities.
                </p>
                <p>
                  Only aggregate learner population data is published. No
                  personal learner information is displayed.
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
