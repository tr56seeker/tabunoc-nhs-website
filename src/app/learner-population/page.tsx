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
  return new Intl.NumberFormat("en-US").format(count);
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

export default function LearnerPopulationPage() {
  const populationData = readPopulationRows();
  const schoolYear = populationData[0]?.schoolYear ?? "";
  const lastUpdated = populationData[0]?.lastUpdated ?? "";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] text-[#24313E]">
        <section className="px-6 pb-16 pt-36">
          <div className="mx-auto max-w-6xl">
            <BrandHeader />

            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex border-l-4 border-[#ffdf20] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#24313E] shadow-sm">
                {schoolYear}
              </p>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-[#24313E] md:text-6xl">
                Learner Population
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 md:text-lg">
                Aggregate school-level learner population for public information
                and school profile reference.
              </p>

              {lastUpdated ? (
                <p className="mt-4 text-sm font-bold text-slate-500">
                  Last Updated: {formatDate(lastUpdated)}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-3">
              {populationData.map((item) => (
                <div
                  key={item.category}
                  className={`border bg-white p-6 shadow-sm ${
                    item.sortOrder === 1
                      ? "border-[#ffdf20] md:col-span-1"
                      : "border-slate-200"
                  }`}
                >
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    {item.category}
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {item.grades}
                  </p>

                  <p className="mt-5 text-5xl font-black tracking-tight text-[#24313E] md:text-6xl">
                    {formatCount(item.count)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="border-l-4 border-[#24313E] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#24313E]">
                  Public Summary Notes
                </h2>
                <div className="mt-3 space-y-2">
                  {populationData.map((item) => (
                    <p
                      key={`${item.sortOrder}-${item.category}`}
                      className="text-sm font-semibold leading-6 text-slate-600"
                    >
                      <span className="font-black text-[#24313E]">
                        {item.category}:
                      </span>{" "}
                      {item.note}
                    </p>
                  ))}
                </div>
              </div>

              <div className="border-l-4 border-[#ffdf20] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#24313E]">
                  Data Note
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  Figures are aggregate school-level data and may change based
                  on official validation.
                </p>
              </div>

              <div className="border-l-4 border-[#24313E] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#24313E]">
                  Data Privacy Reminder
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  No learner names, LRN, addresses, contact details, sections,
                  or personally identifiable data are published.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
