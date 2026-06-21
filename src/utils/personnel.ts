export function formatPersonnelDisplayName(person: {
  displayName?: string;
  name?: string;
  positionSuffix?: string;
}) {
  const baseName = (person.displayName || person.name || "").trim();
  const suffix = person.positionSuffix?.trim();

  if (!suffix) return baseName;

  if (baseName.toLowerCase().endsWith(`, ${suffix.toLowerCase()}`)) {
    return baseName;
  }

  return `${baseName}, ${suffix}`;
}
