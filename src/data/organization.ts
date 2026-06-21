export type PersonnelRole =
  | "Principal"
  | "Administrative"
  | "Guidance"
  | "Master Teacher"
  | "Grade Leader"
  | "SHS Coordinator"
  | "Class Adviser"
  | "Subject Teacher"
  | "Program Implementer"
  | "Support Personnel";

export type AdvisoryAssignment = {
  gradeLevel: string;
  section: string;
};

export type Personnel = {
  id: string;
  name: string;
  displayName?: string;
  positionSuffix?: string;
  firstName?: string;
  position: string;
  designation?: string[];
  roles: PersonnelRole[];
  group: string;
  department?: string;
  designation1?: string;
  advisory?: AdvisoryAssignment[];
  gradeLevelTaught?: string[];
  teachingLevel?: string;
  sectionsHandled?: string[];
  subjectTaught?: string[];
  coordinatorship?: string[];
  philosophy?: string;
  bio?: string;
  email?: string;
  messenger?: string;
  consultationSchedule?: string;
  photo?: string;
  description?: string;
};

export const personnel: Personnel[] = [
  {
    id: "guillermo-villavelez",
    name: "GUILLERMO B. VILLAVELEZ",
    position: "Principal I",
    designation: ["School Head"],
    roles: ["Principal"],
    group: "School Leadership",
    department: "Office of the School Head",
    photo: "/teachers/guillermo-villavelez.jpg",
    description:
      "Provides overall leadership, supervision, governance, and strategic direction for school operations and instructional delivery.",
    bio:
      "Provides overall leadership, supervision, governance, and strategic direction for school operations and instructional delivery.",
    consultationSchedule: "By appointment through official school channels",
  },

  {
    id: "nina-kristine-ayos",
    name: "NIÑA KRISTINE A. AYOS",
    position: "Administrative Officer II",
    designation: [],
    roles: ["Administrative"],
    group: "Administrative Personnel",
    department: "Administrative Office",
    photo: "/teachers/niña-kristine-ayos.jpg",
    bio:
      "Provides administrative and operational support for school management, personnel services, and office transactions.",
    consultationSchedule: "Through official school office hours",
  },
  {
    id: "dawn-camille-caparida",
    name: "DAWN CAMILLE L. CAPARIDA",
    position: "Administrative Assistant I",
    designation: [],
    roles: ["Administrative"],
    group: "Administrative Personnel",
    department: "Administrative Office",
    photo: "/teachers/dawn-camille-caparida.jpg",
    bio:
      "Supports clerical, records, and administrative services of the school.",
    consultationSchedule: "Through official school office hours",
  },
  {
    id: "joan-cabalda",
    name: "JOAN A. CABALDA",
    position: "Administrative Assistant I",
    designation: [],
    roles: ["Administrative"],
    group: "Administrative Personnel",
    department: "Administrative Office",
    photo: "/teachers/joan-cabalda.jpg",
    bio:
      "Supports clerical, records, and administrative services of the school.",
    consultationSchedule: "Through official school office hours",
  },
  {
    id: "jasmin-cabuenas",
    name: "JASMIN B. CABUENAS",
    position: "Registered Guidance Counselor",
    designation: ["Guidance and Learner Support"],
    roles: ["Guidance"],
    group: "Guidance and Learner Support",
    department: "Guidance Office",
    coordinatorship: ["Guidance and Learner Support"],
    photo: "/teachers/jasmin-cabuenas.jpg",
    bio:
      "Provides learner welfare support, guidance services, counseling coordination, and referral assistance.",
    consultationSchedule: "By appointment through official school channels",
  },

  {
    id: "hector-cabanca",
    name: "HECTOR R. CABANCA",
    position: "Master Teacher I",
    designation: ["Grade 9 Leader"],
    roles: ["Master Teacher", "Grade Leader"],
    group: "Instructional Leadership",
    department: "Junior High School",
    coordinatorship: ["Grade 9 Leader"],
    photo: "/teachers/hector-cabanca.jpg",
    bio:
      "Supports instructional supervision, teacher mentoring, curriculum implementation, and grade-level coordination.",
    consultationSchedule: "By appointment through official school channels",
  },
  {
    id: "paz-abad",
    name: "PAZ V. ABAD",
    position: "Master Teacher I",
    designation: ["Grade 10 Leader"],
    roles: ["Master Teacher", "Grade Leader"],
    group: "Instructional Leadership",
    department: "Junior High School",
    coordinatorship: ["Grade 10 Leader"],
    photo: "/teachers/paz-abad.jpg",
    bio:
      "Supports instructional supervision, teacher mentoring, classroom observation, curriculum implementation, and professional development of teachers.",
    consultationSchedule: "By appointment through official school channels",
  },

  {
    id: "nancy-reyes",
    name: "NANCY L. REYES",
    position: "TCH-04",
    designation: ["Grade 7 Leader"],
    roles: ["Grade Leader"],
    group: "Grade Level Leadership",
    department: "Junior High School",
    coordinatorship: ["Grade 7 Leader"],
    photo: "/teachers/nancy-reyes.jpg",
  },
  {
    id: "metchie-gay-gastanes",
    name: "METCHIE GAY A. GASTANES",
    position: "TEACHER VI",
    designation: ["Grade 8 Leader", "Class Adviser"],
    roles: ["Grade Leader", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School / Senior High School",
    advisory: [{ gradeLevel: "Grade 11", section: "11-Athena" }],
    sectionsHandled: ["Grade 11-Athena"],
    coordinatorship: ["Grade 8 Leader"],
    photo: "/teachers/metchie-gay-gastanes.jpg",
    bio:
      "Serves as grade level leader and class adviser, supporting learner monitoring and grade-level coordination.",
    consultationSchedule: "By appointment through official school channels",
  },
  {
    id: "maine-bongas",
    name: "MAINE L. BONGAS",
    position: "Teacher V",
    designation: ["Senior High School Coordinator"],
    roles: ["SHS Coordinator", "Program Implementer"],
    group: "Grade Level Leadership",
    department: "Senior High School",
    coordinatorship: ["Senior High School Coordinator"],
    photo: "/teachers/maine-bongas.jpg",
    bio:
      "Coordinates Senior High School academic and operational concerns, learner support, and SHS program implementation.",
    consultationSchedule: "By appointment through official school channels",
  },

  // Grade 7 Advisers
  {
    id: "endrie-bohol",
    name: "ENDRIE P. BOHOL",
    position: "TEACHER I",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Carrion" }],
    sectionsHandled: ["Grade 7-Carrion"],
    photo: "/teachers/endrie-bohol.jpg",
  },
  {
    id: "ruth-briones",
    name: "RUTH BRIONES",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Daisy" }],
    sectionsHandled: ["Grade 7-Daisy"],
    photo: "/teachers/ruth-briones.jpg",
  },
  {
    id: "elbert-misterio",
    name: "ELBERT L. MISTERIO",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Hyacinth" }],
    sectionsHandled: ["Grade 7-Hyacinth"],
    photo: "/teachers/elbert-misterio.jpg",
  },
  {
    id: "leslyn-rose-camero",
    name: "LESLYN ROSE L. CAMERO",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Periwinkle" }],
    sectionsHandled: ["Grade 7-Periwinkle"],
    photo: "/teachers/leslyn-rose-camero.jpg",
  },
  {
    id: "junnelyn-herbito",
    name: "JUNNELYN R. HERBITO",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Rose" }],
    sectionsHandled: ["Grade 7-Rose"],
    photo: "/teachers/junnelyn-herbito.jpg",
  },
  {
    id: "gwendolyn-olo",
    name: "GWENDOLYN F. OLO",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Stargazer" }],
    sectionsHandled: ["Grade 7-Stargazer"],
    photo: "/teachers/gwendolyn-olo.jpg",
  },

  // Grade 8 Advisers
  {
    id: "joy-mortal",
    name: "JOY E. MORTAL",
    position: "TEACHER I",
    designation: ["Prefect of Descipline", "Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Canary" }],
    sectionsHandled: ["Grade 8-Canary"],
    photo: "/teachers/joy-mortal.jpg",
  },
  {
    id: "genesa-goc-ong",
    name: "GENESA D. GOC-ONG",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Dove" }],
    sectionsHandled: ["Grade 8-Dove"],
    photo: "/teachers/genesa-goc-ong.jpg",
  },
  {
    id: "bret-kalvin-primacio",
    name: "BRET KALVIN S. PRIMACIO",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Eagle" }],
    sectionsHandled: ["Grade 8-Eagle"],
    photo: "/teachers/bret-kalvin-primacio.jpg",
  },
  {
    id: "jeralyn-gerra",
    name: "JERALYN D. GERRA",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Falcon" }],
    sectionsHandled: ["Grade 8-Falcon"],
    photo: "/teachers/jeralyn-gerra.jpg",
  },
  {
    id: "eljoy-barroca",
    name: "ELJOY P. BARROCA",
    position: "TEACHER III",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Raven" }],
    sectionsHandled: ["Grade 8-Raven"],
    photo: "/teachers/eljoy-barroca.jpg",
  },
  {
    id: "marissa-abalo",
    name: "MARISSA G. ABALO",
    position: "TEACHER I",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Swan" }],
    sectionsHandled: ["Grade 8-Swan"],
    photo: "/teachers/marissa-abalo.jpg",
  },

  // Grade 9 Advisers
  {
    id: "jeralen-maloloy-on",
    name: "JERALEN L. MALOLOY-ON",
    position: "TEACHER IV",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Aspen" }],
    sectionsHandled: ["Grade 9-Aspen"],
    photo: "/teachers/jeralen-maloloy-on.jpg",
  },
  {
    id: "lourence-capa",
    name: "LOURENCE CAPA",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Cypress" }],
    sectionsHandled: ["Grade 9-Cypress"],
    photo: "/teachers/lourence-capa.jpg",
  },
  {
    id: "angelo-saavedra",
    name: "ANGELO P. SAAVEDRA",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Elm" }],
    sectionsHandled: ["Grade 9-Elm"],
    photo: "/teachers/angelo-saavedra.jpg",
  },
  {
    id: "bella-samontanez",
    name: "BELLA ARQUINE T. SAMONTANEZ",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Hazel" }],
    sectionsHandled: ["Grade 9-Hazel"],
    photo: "/teachers/bella-samontanez.jpg",
  },
  {
    id: "allan-aparicio",
    name: "ALLAN RAUL R. APARICIO",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Maple" }],
    sectionsHandled: ["Grade 9-Maple"],
    photo: "/teachers/allan-aparicio.jpg",
  },
  {
    id: "jeffrey-caberte",
    name: "JEFFREY A. CABERTE",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Olive" }],
    sectionsHandled: ["Grade 9-Olive"],
    photo: "/teachers/jeffrey-caberte.jpg",
  },

  // Grade 10 Advisers
  {
    id: "joan-cavite",
    name: "JOAN G. CAVITE",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Amethyst" }],
    sectionsHandled: ["Grade 10-Amethyst"],
    photo: "/teachers/joan-cavite.jpg",
  },
  {
    id: "roxan-mae-jao",
    name: "ROXAN MAE T. JAO",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Diamond" }],
    sectionsHandled: ["Grade 10-Diamond"],
    photo: "/teachers/roxan-mae-jao.jpg",
  },
  {
    id: "marilou-cabriana",
    name: "MARILOU L. CABRIANA",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Emerald" }],
    sectionsHandled: ["Grade 10-Emerald"],
    photo: "/teachers/marilou-cabriana.jpg",
  },
  {
    id: "sharon-alsa",
    name: "SHARON GAY B. ALSA",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Jade" }],
    sectionsHandled: ["Grade 10-Jade"],
    photo: "/teachers/sharon-alsa.jpg",
  },
  {
    id: "jake-barcenas",
    name: "JAKE T. BARCENAS",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Ruby" }],
    sectionsHandled: ["Grade 10-Ruby"],
    photo: "/teachers/jake-barcenas.jpg",
  },
  {
    id: "jay-neil-oro",
    name: "JAY NEIL B. ORO",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Sapphire" }],
    sectionsHandled: ["Grade 10-Sapphire"],
    photo: "/teachers/jay-neil-oro.jpg",
  },

  // SHS / Grade 11 and 12
  {
    id: "joseph-dagaraga",
    name: "JOSEPH C. DAGARAGA, JR.",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School",
    advisory: [
      { gradeLevel: "Grade 11", section: "11-Aphrodite" },
      { gradeLevel: "Grade 11", section: "11-Hestia" },
      { gradeLevel: "Grade 11", section: "11-Poseidon" },
      { gradeLevel: "Grade 12", section: "12-Saturn" },
    ],
    sectionsHandled: [
      "Grade 11-Aphrodite",
      "Grade 11-Hestia",
      "Grade 11-Poseidon",
      "Grade 12-Saturn",
    ],
    subjectTaught: [],
    photo: "/teachers/joseph-dagaraga.jpg",
    bio:
      "Serves as a Senior High School teacher and class adviser, supporting learner progress and classroom-based guidance.",
    consultationSchedule: "By appointment through official school channels",
  },
  {
    id: "lonier-andrade",
    name: "LONIER C. ANDRADE",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School",
    advisory: [
      { gradeLevel: "Grade 11", section: "11-Apollo" },
      { gradeLevel: "Grade 11", section: "11-Demeter" },
      { gradeLevel: "Grade 11", section: "11-Hades" },
    ],
    gradeLevelTaught: ["Grade 11", "Grade 12"],
    sectionsHandled: ["Grade 11-Apollo", "Grade 11-Demeter", "Grade 11-Hades"],
    subjectTaught: ["SHS/TVL Electrical Installation and Maintenance 11 & 12"],
    philosophy:
      "I believe that teaching should empower learners to become skilled, disciplined, and confident individuals who are ready for real-life work and lifelong learning.",
    bio:
      "Serves as a Senior High School teacher and class adviser, supporting learners in technical-vocational skills development, values formation, and academic growth.",
    email: "lonier.andrade@deped.gov.ph",
    messenger: "https://m.me/PHAP03261994",
    consultationSchedule: "By appointment through official school channels",
    photo: "/teachers/lonier-andrade.jpg",
  },
  {
    id: "marissa-pintuan",
    name: "MARISSA J. PINTUAN",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School",
    advisory: [
      { gradeLevel: "Grade 11", section: "11-Erebus" },
      { gradeLevel: "Grade 11", section: "11-Hera" },
    ],
    sectionsHandled: ["Grade 11-Erebus", "Grade 11-Hera"],
    subjectTaught: [],
    photo: "/teachers/marissa-pintuan.jpg",
  },
  {
    id: "angel-batuigas",
    name: "ANGEL C. BATUIGAS",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School",
    advisory: [
      { gradeLevel: "Grade 12", section: "12-Earth" },
      { gradeLevel: "Grade 12", section: "12-Mars" },
    ],
    sectionsHandled: ["Grade 12-Earth", "Grade 12-Mars"],
    subjectTaught: [],
    photo: "/teachers/angel-batuigas",
  },
  {
    id: "jevy-ann-uy",
    name: "JEVY ANN O. UY",
    position: "Teacher",
    designation: ["Class Adviser"],
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School",
    advisory: [{ gradeLevel: "Grade 12", section: "12-Jupiter" }],
    sectionsHandled: ["Grade 12-Jupiter"],
    subjectTaught: [],
    photo: "/teachers/jevy-ann-uy.jpg",
  },
  {
    id: "glendale-orocay",
    name: "GLENDALE R. OROCAY",
    position: "TCH-01",
    designation: ["Class Adviser"],
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School",
    advisory: [{ gradeLevel: "Grade 12", section: "12-Venus" }],
    sectionsHandled: ["Grade 12-Venus"],
    subjectTaught: ["Hairdressing", "Beauty Care"],
    photo: "/teachers/glendale-orocay.jpg",
  },

  {
    id: "richie-ryan-mabunay",
    name: "RICHIE RYAN C. MABUNAY",
    position: "T-3",
    designation: ["School DRRM Coordinator"],
    roles: ["Subject Teacher", "Program Implementer"],
    group: "Teaching Personnel",
    department: "Senior High School",
    gradeLevelTaught: ["Grade 11", "Grade 12"],
    sectionsHandled: ["Grade 11-Apollo", "Grade 12-Jupiter"],
    subjectTaught: ["Electrical Installation and Maintenance 11 & 12"],
    coordinatorship: ["School DRRM Coordinator"],
    philosophy:
      "I believe that technical-vocational education should develop learners who are skilled, safety-conscious, disciplined, and ready for real-world work.",
    bio:
      "A Senior High School teacher handling Electrical Installation and Maintenance and serving as School Disaster Risk Reduction and Management Coordinator.",
    email: "richieryan.mabunay@deped.gov.ph",
    messenger: "https://m.me/tr56seeker",
    consultationSchedule: "By appointment through official school channels",
    photo: "/teachers/richie-ryan-mabunay.jpg",
  },
  {
    id: "benerando-erediano",
    name: "BENERANDO C. EREDIANO",
    position: "Teacher",
    designation: ["Subject Teacher"],
    roles: ["Subject Teacher"],
    group: "Teaching Personnel",
    department: "Senior High School",
    subjectTaught: ["Electronic Products Assembly and Servicing"],
    photo: "/teachers/benerando-erediano.jpg",
  },
];

export const gradeLevels = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

function getGradeLeaderSortRank(person: Personnel): number {
  const label =
    person.coordinatorship?.find((item) => /Grade \d+|Senior High/i.test(item)) ||
    person.designation?.find((item) => /Grade \d+|Senior High/i.test(item)) ||
    "";

  const gradeMatch = label.match(/Grade\s*(\d+)/i);
  if (gradeMatch) {
    return Number(gradeMatch[1]);
  }

  if (/Senior\s+High/i.test(label)) {
    return 12;
  }

  return 0;
}

export const leadership = personnel.filter((person) =>
  person.roles.includes("Principal")
);

export const administrativePersonnel = personnel.filter(
  (person) =>
    person.roles.includes("Administrative") || person.roles.includes("Guidance")
);

export const masterTeachers = personnel
  .filter((person) => person.roles.includes("Master Teacher"))
  .sort((a, b) => {
    const rankA = getGradeLeaderSortRank(a);
    const rankB = getGradeLeaderSortRank(b);

    if (rankA !== rankB) {
      return rankB - rankA;
    }

    return a.name.localeCompare(b.name);
  });

export const gradeLeaders = personnel
  .filter(
    (person) =>
      person.roles.includes("Grade Leader") ||
      person.roles.includes("SHS Coordinator")
  )
  .sort((a, b) => {
    const rankA = getGradeLeaderSortRank(a);
    const rankB = getGradeLeaderSortRank(b);

    if (rankA !== rankB) {
      return rankB - rankA;
    }

    return a.name.localeCompare(b.name);
  });

export const classAdvisers = personnel.filter(
  (person) => person.advisory && person.advisory.length > 0
);

export const subjectTeachers = personnel.filter((person) =>
  person.roles.includes("Subject Teacher")
);

export const programImplementers = personnel.filter((person) =>
  person.roles.includes("Program Implementer")
);

export const allPersonnel = personnel;
