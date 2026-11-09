import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { memoCategories } from "@/data/memos";
import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const BUCKET = "school-memos";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const allowedCategories = new Set<string>(memoCategories.filter((category) => category !== "All"));

function textValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("school_memos")
      .select("*")
      .order("date_issued", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ memos: data ?? [] });
  } catch (error) {
    console.error("Unable to load admin school memos:", error);
    return NextResponse.json(
      { error: "Memos could not be loaded. Apply the admin database migration first." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { adminUser, response } = await requireAdminApi(request);
  if (response || !adminUser) return response;

  try {
    const formData = await request.formData();
    const memoNumber = textValue(formData.get("memoNumber"));
    const title = textValue(formData.get("title"));
    const dateIssued = textValue(formData.get("dateIssued"));
    const category = textValue(formData.get("category"));
    const issuingOffice = textValue(formData.get("issuingOffice"));
    const description = textValue(formData.get("description"));
    const status = textValue(formData.get("status")) || "draft";
    const file = formData.get("file");

    if (!memoNumber || !title || !issuingOffice || !validDate(dateIssued)) {
      return NextResponse.json(
        { error: "Memo number, title, valid issue date, and issuing office are required." },
        { status: 400 },
      );
    }
    if (!allowedCategories.has(category)) {
      return NextResponse.json({ error: "Select a valid memo category." }, { status: 400 });
    }
    if (!new Set(["draft", "published"]).has(status)) {
      return NextResponse.json({ error: "Status must be draft or published." }, { status: 400 });
    }
    if (
      memoNumber.length > 100 ||
      title.length > 240 ||
      issuingOffice.length > 160 ||
      description.length > 1500
    ) {
      return NextResponse.json({ error: "One or more fields exceed their character limit." }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Attach the official memo PDF." }, { status: 400 });
    }
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Memo file must be a PDF." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Memo PDF must be 15 MB or smaller." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const filePath = `memos/${new Date().getFullYear()}/${Date.now()}-${randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { contentType: "application/pdf", upsert: false });

    if (uploadError) {
      console.error("Unable to upload memo PDF:", uploadError.message);
      return NextResponse.json({ error: "The memo PDF could not be uploaded." }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    const { data, error } = await supabase
      .from("school_memos")
      .insert({
        memo_number: memoNumber,
        title,
        date_issued: dateIssued,
        category,
        issuing_office: issuingOffice,
        description,
        file_path: filePath,
        file_url: publicUrlData.publicUrl,
        status,
        created_by: adminUser.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Unable to save school memo:", error.message);
      await supabase.storage.from(BUCKET).remove([filePath]);
      return NextResponse.json({ error: "The memo record could not be saved." }, { status: 500 });
    }

    return NextResponse.json({ memo: data }, { status: 201 });
  } catch (error) {
    console.error("Unable to create school memo:", error);
    return NextResponse.json({ error: "The memo could not be saved." }, { status: 500 });
  }
}
