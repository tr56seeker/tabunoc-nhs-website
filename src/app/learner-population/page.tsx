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
  return new Intl.NumberFormat("en-PH").format(count);
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
  const totalRow =
    populationData.find((item) => item.category === "Total Learners") ??
    populationData[0];

  const programRows = populationData.filter(
    (item) => item.category !== "Total Learners"
  );

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
                Tabunoc National High School serves learners from Junior High
                School and Senior High School. The figures below present the
                current school-level enrollment summary for public information
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
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              {totalRow ? (
                <div
                  key={totalRow.category}
                  className="border border-[#ffdf20] bg-white p-7 shadow-sm md:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                        Total Learners
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-500">
                        {totalRow.grades}
                      </p>
                    </div>

                    {schoolYear ? (
                      <p className="inline-flex w-fit bg-[#ffdf20] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#24313E]">
                        {schoolYear}
                      </p>
                    ) : null}
                  </div>

                  <p className="mt-8 text-6xl font-black tracking-tight text-[#24313E] md:text-7xl">
                    {formatCount(totalRow.count)}
                  </p>

                  {lastUpdated ? (
                    <p className="mt-5 text-sm font-bold text-slate-500">
                      Last Updated: {formatDate(lastUpdated)}
                    </p>
                  ) : null}
                </div>

              ) : null}

              <div className="grid gap-4">
                {programRows.map((item) => (
                  <div
                    key={item.category}
                    className="border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      {item.category}
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-500">
                      {item.grades}
                    </p>

                    <p className="mt-5 text-5xl font-black tracking-tight text-[#24313E]">
                      {formatCount(item.count)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="border-t-4 border-[#ffdf20] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#24313E]">
                  Enrollment Profile
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  The learner population reflects the combined enrollment of
                  Junior High School and Senior High School learners of Tabunoc
                  National High School for the indicated school year.
                </p>
              </div>

              <div className="border-t-4 border-[#24313E] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#24313E]">
                  Data Source and Update Status
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  Figures are based on available school enrollment records and
                  are subject to updating based on official validation.
                </p>
              </div>

              <div className="border-t-4 border-[#24313E] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#24313E]">
                  Privacy Notice
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  Only aggregate learner population figures are published. This
                  page does not display learner names, Learner Reference
                  Numbers, section lists, addresses, contact numbers, or
                  sensitive learner information.
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
