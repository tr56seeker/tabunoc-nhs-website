export const evacuationRoutes = {
  "Grade 11 Building - Room 204": {
    building: "Grade 11 Building",
    floor: "Second Floor",
    evacuationArea: "Evacuation Area A - Open Ground",
    fire: {
      exit: "Use the nearest stairway. Do not use congested corridors.",
      route: "Room 204 → Hallway → Stairway → Ground Floor Exit → Open Ground",
    },
    earthquake: {
      exit: "After shaking stops, follow the class adviser to the stairway.",
      route: "Duck-Cover-Hold → Hallway Assembly → Stairway → Open Ground",
    },
  },
  "Covered Court": {
    building: "Covered Court",
    floor: "Ground Level",
    evacuationArea: "Evacuation Area B - Main Open Space",
    fire: {
      exit: "Move calmly toward the nearest open side exit.",
      route: "Covered Court → Nearest Side Exit → Main Open Space",
    },
    earthquake: {
      exit: "Move away from posts, walls, and hanging objects.",
      route: "Covered Court → Open Side Exit → Main Open Space",
    },
  },
  "School Clinic": {
    building: "Administration Area",
    floor: "Ground Level",
    evacuationArea: "Evacuation Area A - Open Ground",
    fire: {
      exit: "Exit through the main clinic door with assistance if needed.",
      route: "Clinic → Admin Hallway → Main Exit → Open Ground",
    },
    earthquake: {
      exit: "Assist patient first, then evacuate when safe.",
      route: "Duck-Cover-Hold → Clinic Exit → Admin Hallway → Open Ground",
    },
  },
};

export type EvacuationLocation = keyof typeof evacuationRoutes;
export type EmergencyType = "fire" | "earthquake";