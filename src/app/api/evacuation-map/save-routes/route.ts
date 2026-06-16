import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { message: "Saving evacuation routes is disabled in production." },
      { status: 403 },
    );
  }

  const data = await request.json();

  if (!data || !Array.isArray(data.locations)) {
    return NextResponse.json(
      { message: "Invalid evacuation map data. Expected a locations array." },
      { status: 400 },
    );
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "evacuation-map-routes.json",
  );

  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  return NextResponse.json({
    message: "Evacuation map routes saved successfully.",
  });
}
