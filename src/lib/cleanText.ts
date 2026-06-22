export function cleanText(value: unknown) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replaceAll("\u00E2\u20AC\u201C", "–")
    .replaceAll("\u00E2\u20AC\u201D", "—")
    .replaceAll("\u00C2\u00B7", "·")
    .replaceAll("\u00E2\u20AC\u0153", "“")
    .replaceAll("\u00E2\u20AC\u009D", "”")
    .replaceAll("\u00E2\u20AC\u02DC", "‘")
    .replaceAll("\u00E2\u20AC\u2122", "’")
    .replaceAll("\u00E2\u20AC\u00A6", "…")
    .replaceAll("\u00E2\u20AC\u00BA", "›")
    .replaceAll("\u00E2\u2020\u2019", "→");
}
