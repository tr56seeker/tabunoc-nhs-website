const locationSorter = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function getLocationLabel(location: { label?: string; name?: string }) {
  return location.label ?? location.name ?? "";
}

function getFloorOrder(label: string) {
  const upper = label.toUpperCase();

  if (upper.includes("G/F") || upper.includes("1/F")) return 1;

  const match = upper.match(/(\d+)\/F/);
  if (match) return Number(match[1]);

  return 999;
}

function getRoomNumber(label: string) {
  const upper = label.toUpperCase();
  const match = upper.match(/\bRM[\s_/-]*0*(\d+)\b/);

  if (match) return Number(match[1]);

  return 999;
}

function getBuildingKey(label: string) {
  const upper = label.toUpperCase();

  if (upper.includes("SHS BLDG")) return "SHS BLDG";
  if (upper.includes("SEDP")) return "SEDP";
  if (upper.includes("BL-1")) return "BL-1";
  if (upper.includes("BL-2")) return "BL-2";

  return upper
    .replace(/\b(?:G|[1-9])\/F\b/g, "")
    .replace(/\bRM[\s_/-]*0*\d+\b/g, "")
    .replace(/[,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getBuildingOrder(buildingKey: string) {
  const knownOrder = ["SHS BLDG", "SEDP", "BL-1", "BL-2"];
  const index = knownOrder.indexOf(buildingKey);

  return index === -1 ? knownOrder.length : index;
}

function hasStructuredRoomLabel(label: string) {
  const upper = label.toUpperCase();
  return /\b(?:G|[1-9])\/F\b/.test(upper) || /\bRM[\s_/-]*0*\d+\b/.test(upper);
}

export function sortLocationsByLabel<T extends { label: string }>(locations: T[]) {
  return [...locations].sort((a, b) => {
    const labelA = getLocationLabel(a);
    const labelB = getLocationLabel(b);
    const buildingKeyA = getBuildingKey(labelA);
    const buildingKeyB = getBuildingKey(labelB);

    const buildingOrderCompare =
      getBuildingOrder(buildingKeyA) - getBuildingOrder(buildingKeyB);
    if (buildingOrderCompare !== 0) return buildingOrderCompare;

    const buildingCompare = locationSorter.compare(buildingKeyA, buildingKeyB);
    if (buildingCompare !== 0) return buildingCompare;

    const structuredCompare =
      Number(!hasStructuredRoomLabel(labelA)) - Number(!hasStructuredRoomLabel(labelB));
    if (structuredCompare !== 0) return structuredCompare;

    const floorCompare = getFloorOrder(labelA) - getFloorOrder(labelB);
    if (floorCompare !== 0) return floorCompare;

    const roomCompare = getRoomNumber(labelA) - getRoomNumber(labelB);
    if (roomCompare !== 0) return roomCompare;

    return locationSorter.compare(labelA, labelB);
  });
}
