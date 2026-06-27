import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const BUCKET = "homepage-highlights";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function optionalText(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseDisplayOrder(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function validDate(value: string | null) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validFacebookUrl(value: string | null) {
  if (!value) return true;
  if (value.length > 500 || !value.startsWith("https://")) return false;

  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === "facebook.com" ||
      hostname.endsWith(".facebook.com") ||
      hostname === "fb.watch"
    );
  } catch {
    return false;
  }
}

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("homepage_highlights")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ highlights: data ?? [] });
  } catch (error) {
    console.error("Unable to load admin homepage highlights:", error);
    return NextResponse.json(
      { error: "Highlights could not be loaded right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    const formData = await request.formData();
    const title = optionalText(formData.get("title"));
    const description = optionalText(formData.get("description"));
    const category = optionalText(formData.get("category"));
    const altText = optionalText(formData.get("altText"));
    const facebookUrl = optionalText(formData.get("facebookUrl"));
    const eventDate = optionalText(formData.get("eventDate"));
    const displayOrder = parseDisplayOrder(formData.get("displayOrder"));
    const status = optionalText(formData.get("status")) ?? "draft";
    const image = formData.get("image");

    if (!title) {
      return NextResponse.json({ error: "A title is required." }, { status: 400 });
    }
    if (title.length > 120 || (description?.length ?? 0) > 600 || (category?.length ?? 0) > 80) {
      return NextResponse.json(
        { error: "Title, description, or category exceeds its character limit." },
        { status: 400 },
      );
    }
    if (!validDate(eventDate)) {
      return NextResponse.json({ error: "Event date is invalid." }, { status: 400 });
    }
    if (!validFacebookUrl(facebookUrl)) {
      return NextResponse.json(
        { error: "Facebook Post URL must be a valid HTTPS facebook.com or fb.watch link (maximum 500 characters)." },
        { status: 400 },
      );
    }
    if (displayOrder === null) {
      return NextResponse.json({ error: "Display order must be a whole number." }, { status: 400 });
    }
    if (!['draft', 'published'].includes(status)) {
      return NextResponse.json({ error: "Status must be draft or published." }, { status: 400 });
    }
    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ error: "A photo is required." }, { status: 400 });
    }
    const extension = allowedImageTypes[image.type];
    if (!extension) {
      return NextResponse.json({ error: "Photo must be JPG, PNG, or WebP." }, { status: 400 });
    }
    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Photo must be 5 MB or smaller." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const imagePath = `homepage-highlights/${Date.now()}-${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(imagePath, image, { contentType: image.type, upsert: false });

    if (uploadError) {
      console.error("Unable to upload homepage highlight:", uploadError.message);
      return NextResponse.json({ error: "The photo could not be uploaded." }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(imagePath);
    const { data, error } = await supabase
      .from("homepage_highlights")
      .insert({
        title,
        description,
        category,
        alt_text: altText,
        facebook_url: facebookUrl,
        event_date: eventDate,
        display_order: displayOrder,
        status,
        image_path: imagePath,
        image_url: publicUrlData.publicUrl,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Unable to save homepage highlight:", error.message);
      await supabase.storage.from(BUCKET).remove([imagePath]);
      return NextResponse.json({ error: "The highlight could not be saved." }, { status: 500 });
    }

    return NextResponse.json({ highlight: data }, { status: 201 });
  } catch (error) {
    console.error("Unable to create homepage highlight:", error);
    return NextResponse.json({ error: "The highlight could not be saved." }, { status: 500 });
  }
}
