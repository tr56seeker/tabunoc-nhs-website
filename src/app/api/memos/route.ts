import { NextResponse } from "next/server";

import { memos as fallbackMemos } from "@/data/memos";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("school_memos")
      .select("*")
      .eq("status", "published")
      .order("date_issued", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      memos: (data ?? []).map((memo) => ({
        id: memo.id,
        memoNumber: memo.memo_number,
        title: memo.title,
        dateIssued: memo.date_issued,
        category: memo.category,
        issuingOffice: memo.issuing_office,
        description: memo.description,
        fileUrl: memo.file_url,
        isPublic: true,
      })),
    });
  } catch (error) {
    console.error("Unable to load public school memos:", error);
    return NextResponse.json({ memos: fallbackMemos });
  }
}
