export type PersonnelRole =
  | "Principal"
  | "Administrative"
  | "Guidance"
  | "Master Teacher"
  | "Grade Leader"
  | "SHS Coordinator"
  | "Class Adviser"
  | "Subject Teacher"
  | "Program Coordinator"
  | "Support Personnel";

export type AdvisoryAssignment = {
  gradeLevel: string;
  section: string;
};

export type Personnel = {
  id: string;
  name: string;
  position: string;
  roles: PersonnelRole[];
  group: string;
  department?: string;
  advisory?: AdvisoryAssignment[];
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
    position: "School Head / Principal",
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
    id: "nina-kristine-alinsonorin",
    name: "AYOS, NIÑA KRISTINE ALINSONORIN",
    position: "Administrative Officer II",
    roles: ["Administrative"],
    group: "Administrative Personnel",
    department: "Administrative Office",
    photo: "",
    bio:
      "Provides administrative and operational support for school management, personnel services, and office transactions.",
    consultationSchedule: "Through official school office hours",
  },
  {
    id: "dawn-camille-caparida",
    name: "CAPARIDA, DAWN CAMILLE LABAJO",
    position: "Administrative Assistant I",
    roles: ["Administrative"],
    group: "Administrative Personnel",
    department: "Administrative Office",
    photo: "",
    bio:
      "Supports clerical, records, and administrative services of the school.",
    consultationSchedule: "Through official school office hours",
  },
  {
    id: "joan-cabalda",
    name: "CABALDA, JOAN ABELLANA",
    position: "Administrative Assistant I",
    roles: ["Administrative"],
    group: "Administrative Personnel",
    department: "Administrative Office",
    photo: "",
    bio:
      "Supports clerical, records, and administrative services of the school.",
    consultationSchedule: "Through official school office hours",
  },
  {
    id: "jasmin-cabuenas",
    name: "CABUENAS, JASMIN BENTIC",
    position: "Registered Guidance Counselor",
    roles: ["Guidance"],
    group: "Guidance and Learner Support",
    department: "Guidance Office",
    coordinatorship: ["Guidance and Learner Support"],
    photo: "",
    bio:
      "Provides learner welfare support, guidance services, counseling coordination, and referral assistance.",
    consultationSchedule: "By appointment through official school channels",
  },

  {
    id: "hector-cabanca",
    name: "HECTOR R. CABANCA",
    position: "Master Teacher I, Grade 9 Leader",
    roles: ["Master Teacher", "Grade Leader"],
    group: "Instructional Leadership",
    department: "Junior High School Department",
    coordinatorship: ["Grade 9 Leader"],
    photo: "",
    bio:
      "Supports instructional supervision, teacher mentoring, curriculum implementation, and grade-level coordination.",
    consultationSchedule: "By appointment through official school channels",
  },
  {
    id: "paz-abad",
    name: "PAZ V. ABAD",
    position: "Master Teacher I, Grade 10 Leader",
    roles: ["Master Teacher", "Grade Leader"],
    group: "Instructional Leadership",
    department: "Junior High School Department",
    coordinatorship: ["Grade 10 Leader"],
    photo: "",
    bio:
      "Supports instructional supervision, teacher mentoring, classroom observation, curriculum implementation, and professional development of teachers.",
    consultationSchedule: "By appointment through official school channels",
  },

  {
    id: "nancy-reyes",
    name: "NANCY L. REYES",
    position: "Grade 7 Leader",
    roles: ["Grade Leader"],
    group: "Grade Level Leadership",
    department: "Junior High School Department",
    coordinatorship: ["Grade 7 Leader"],
    photo: "",
  },
  {
    id: "metchie-gastanes",
    name: "METCHIE GAY A. GASTANES",
    position: "Grade 8 Leader, Class Adviser",
    roles: ["Grade Leader", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School / Senior High School",
    advisory: [{ gradeLevel: "Grade 11", section: "11-Athena" }],
    coordinatorship: ["Grade 8 Leader"],
    photo: "",
    bio:
      "Serves as grade level leader and class adviser, supporting learner monitoring and grade-level coordination.",
    consultationSchedule: "By appointment through official school channels",
  },
  {
    id: "maine-bongas",
    name: "MAINE L. BONGAS",
    position: "Senior High School Coordinator",
    roles: ["SHS Coordinator", "Program Coordinator"],
    group: "Grade Level Leadership",
    department: "Senior High School Department",
    coordinatorship: ["Senior High School Coordinator"],
    photo: "",
    bio:
      "Coordinates Senior High School academic and operational concerns, learner support, and SHS program implementation.",
    consultationSchedule: "By appointment through official school channels",
  },

  {
    id: "endrie-bohol",
    name: "ENDRIE P. BOHOL",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Carrion" }],
    photo: "",
  },
  {
    id: "ruth-briones",
    name: "RUTH BRIONES",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Daisy" }],
    photo: "",
  },
  {
    id: "elbert-misterio",
    name: "ELBERT L. MISTERIO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Hyacinth" }],
    photo: "",
  },
  {
    id: "leslyn-camero",
    name: "LESLYN ROSE L. CAMERO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Periwinkle" }],
    photo: "",
  },
  {
    id: "junnelyn-herbito",
    name: "JUNNELYN R. HERBITO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Rose" }],
    photo: "",
  },
  {
    id: "gwendolyn-olo",
    name: "GWENDOLYN F. OLO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 7", section: "7-Stargazer" }],
    photo: "",
  },

  {
    id: "joy-mortal",
    name: "JOY E. MORTAL",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Canary" }],
    photo: "",
  },
  {
    id: "genesa-goc-ong",
    name: "GENESA D. GOC-ONG",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Dove" }],
    photo: "",
  },
  {
    id: "bret-primacio",
    name: "BRET KALVIN S. PRIMACIO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Eagle" }],
    photo: "",
  },
  {
    id: "jeralyn-gerra",
    name: "JERALYN D. GERRA",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Falcon" }],
    photo: "",
  },
  {
    id: "eljoy-barroca",
    name: "ELJOY P. BARROCA",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Raven" }],
    photo: "",
  },
  {
    id: "marissa-abalo",
    name: "MARISSA G. ABALO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 8", section: "8-Swan" }],
    photo: "",
  },

  {
    id: "jeralen-maloloy-on",
    name: "JERALEN L. MALOLOY-ON",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Aspen" }],
    photo: "",
  },
  {
    id: "lourence-capa",
    name: "LOURENCE CAPA",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Cypress" }],
    photo: "",
  },
  {
    id: "angelo-saavedra",
    name: "ANGELO P. SAAVEDRA",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Elm" }],
    photo: "",
  },
  {
    id: "bella-samontanez",
    name: "BELLA ARQUINE T. SAMONTANEZ",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Hazel" }],
    photo: "",
  },
  {
    id: "allan-aparicio",
    name: "ALLAN RAUL R. APARICIO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Maple" }],
    photo: "",
  },
  {
    id: "jeffrey-caberte",
    name: "JEFFREY A. CABERTE",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 9", section: "9-Olive" }],
    photo: "",
  },

  {
    id: "joan-cavite",
    name: "JOAN G. CAVITE",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Amethyst" }],
    photo: "",
  },
  {
    id: "roxan-jao",
    name: "ROXAN MAE T. JAO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Diamond" }],
    photo: "",
  },
  {
    id: "marilou-cabriana",
    name: "MARILOU L. CABRIANA",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Emerald" }],
    photo: "",
  },
  {
    id: "sharon-alsa",
    name: "SHARON GAY B. ALSA",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Jade" }],
    photo: "",
  },
  {
    id: "jake-barcenas",
    name: "JAKE T. BARCENAS",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Ruby" }],
    photo: "",
  },
  {
    id: "jay-neil-oro",
    name: "JAY NEIL B. ORO",
    position: "Class Adviser",
    roles: ["Class Adviser"],
    group: "Teaching Personnel",
    department: "Junior High School Department",
    advisory: [{ gradeLevel: "Grade 10", section: "10-Sapphire" }],
    photo: "",
  },

  {
    id: "joseph-dagaraga",
    name: "JOSEPH C. DAGARAGA, JR.",
    position: "Senior High School Teacher, Class Adviser",
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    advisory: [
      { gradeLevel: "Grade 11", section: "11-Aphrodite" },
      { gradeLevel: "Grade 11", section: "11-Hestia" },
      { gradeLevel: "Grade 11", section: "11-Poseidon" },
      { gradeLevel: "Grade 12", section: "12-Saturn" },
    ],
    subjectTaught: [],
    photo: "",
    bio:
      "Serves as a Senior High School teacher and class adviser, supporting learner progress and classroom-based guidance.",
    consultationSchedule: "By appointment through official school channels",
  },
  {
    id: "lonier-andrade",
    name: "LONIER C. ANDRADE",
    position: "Senior High School Teacher, Class Adviser",
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    advisory: [
      { gradeLevel: "Grade 11", section: "11-Apollo" },
      { gradeLevel: "Grade 11", section: "11-Demeter" },
      { gradeLevel: "Grade 11", section: "11-Hades" },
    ],
    subjectTaught: ["Electrical Installation and Maintenance"],
    coordinatorship: ["Class Adviser"],
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
    position: "Senior High School Teacher, Class Adviser",
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    advisory: [
      { gradeLevel: "Grade 11", section: "11-Erebus" },
      { gradeLevel: "Grade 11", section: "11-Hera" },
    ],
    subjectTaught: [],
    photo: "",
  },
  {
    id: "angel-batugas",
    name: "ANGEL C. BATUGAS",
    position: "Senior High School Teacher, Class Adviser",
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    advisory: [
      { gradeLevel: "Grade 12", section: "12-Earth" },
      { gradeLevel: "Grade 12", section: "12-Mars" },
    ],
    subjectTaught: [],
    photo: "",
  },
  {
    id: "jevy-ann-uy",
    name: "JEVY ANN O. UY",
    position: "Senior High School Teacher, Class Adviser",
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    advisory: [{ gradeLevel: "Grade 12", section: "12-Jupiter" }],
    subjectTaught: [],
    photo: "",
  },
  {
    id: "glendale-orocay",
    name: "GLENDALE R. OROCAY",
    position: "Senior High School Teacher, Class Adviser",
    roles: ["Subject Teacher", "Class Adviser"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    advisory: [{ gradeLevel: "Grade 12", section: "12-Venus" }],
    subjectTaught: [],
    photo: "",
  },

  {
    id: "richie-ryan-mabunay",
    name: "RICHIE RYAN C. MABUNAY",
    position:
      "School DRRM Coordinator, SHS/TVL-Electrical Installation and Maintenance Teacher",
    roles: ["Subject Teacher", "Program Coordinator"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
    subjectTaught: ["Electrical Installation and Maintenance"],
    coordinatorship: ["School DRRM Coordinator"],
    philosophy:
      "I believe that technical-vocational education should develop learners who are skilled, safety-conscious, disciplined, and ready for real-world work.",
    bio:
      "A Senior High School teacher handling Electrical Installation and Maintenance and serving as School Disaster Risk Reduction and Management Coordinator.",
    email: "",
    messenger: "",
    consultationSchedule: "By appointment through official school channels",
    photo: "/teachers/richie-ryan-mabunay.jpg",
  },
  {
    id: "benerando-erediano",
    name: "BENERANDO C. EREDIANO",
    position: "Electronic Products Assembly and Servicing Teacher",
    roles: ["Subject Teacher"],
    group: "Teaching Personnel",
    department: "Senior High School Department",
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

export const leadership = personnel.filter((person) =>
  person.roles.includes("Principal")
);

export const administrativePersonnel = personnel.filter(
  (person) =>
    person.roles.includes("Administrative") ||
    person.roles.includes("Guidance")
);

export const masterTeachers = personnel.filter((person) =>
  person.roles.includes("Master Teacher")
);

export const gradeLeaders = personnel.filter(
  (person) =>
    person.roles.includes("Grade Leader") ||
    person.roles.includes("SHS Coordinator")
);

export const classAdvisers = personnel.filter(
  (person) => person.advisory && person.advisory.length > 0
);

export const subjectTeachers = personnel.filter((person) =>
  person.roles.includes("Subject Teacher")
);

export const programCoordinators = personnel.filter((person) =>
  person.roles.includes("Program Coordinator")
);

export const allPersonnel = personnel;