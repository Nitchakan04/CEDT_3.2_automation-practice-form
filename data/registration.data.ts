// data/registration.data.ts
import path from "path";
import type { RegistrationData } from "../pages/RegistrationPage";

export const BASE_URL = "https://demoqa.com/automation-practice-form";

// ==========================
// File Upload Test Data
// ==========================
export const TEST_FILES = {
  png: path.resolve(process.cwd(), "picture", "sample01.png"),
  jpg: path.resolve(process.cwd(), "picture", "sample02.jpg"),
  pdf: path.resolve(process.cwd(), "picture", "sample03.pdf"),
  txt: path.resolve(process.cwd(), "picture", "sample04.txt"),
} as const;

// ==========================
// Email Test Data
// ==========================
export const TEST_EMAILS = {
  validBasic: "name@example.com",
  validUniversity: "nitchakan.kkng@student.chula.ac.th",
  invalidMissingAt: "nameexample.com",
  invalidMissingTld: "name@example",
} as const;

// ==========================
// Mobile Test Data
// ==========================
export const TEST_MOBILES = {
  valid10: "0812345678",
  invalid9: "081234567",
  invalidLetters: "0812345abc",
  invalidSymbols: "0-123@4567",
} as const;

// ==========================
// Name Test Data
// ==========================
export const TEST_NAMES = {
  validFirst: "Nitchakan",
  validLast: "K",
  numeric: "12345",
  special: "Ni@cha",
} as const;

// ==========================
// DOB Widget Test Data
// ==========================
export const TEST_DOB = {
  example: { day: 5, month: 3, year: 2006 },
} as const;

// ==========================
// Subjects Widget Test Data
// ==========================
export const TEST_SUBJECTS = {
  two: ["Maths", "Physics"] as string[],
  three: ["Maths", "Physics", "Chemistry"] as string[],
};

// ==========================
// State / City Dynamic Data
// ==========================
export const TEST_STATE_CITY = {
  NCR: { state: "NCR", city: "Delhi" },
  UP: { state: "Uttar Pradesh", city: "Lucknow" },
} as const;

// ==========================
// Valid Form Data (used in submit tests)
// ==========================
export const VALID_DATA: RegistrationData = {
  firstName: TEST_NAMES.validFirst,
  lastName: TEST_NAMES.validLast,
  email: TEST_EMAILS.validBasic,
  gender: "Female",
  mobile: TEST_MOBILES.valid10,

  dob: TEST_DOB.example,
  subjects: TEST_SUBJECTS.two,
  hobbies: ["Sports", "Reading"],
  picturePath: TEST_FILES.png,
  address: "Bangkok, Thailand",
  state: TEST_STATE_CITY.NCR.state,
  city: TEST_STATE_CITY.NCR.city,
};

// ==========================
// Required Base Data
// ==========================
export const REQUIRED_BASE: RegistrationData = {
  firstName: TEST_NAMES.validFirst,
  lastName: TEST_NAMES.validLast,
  gender: "Female",
  mobile: TEST_MOBILES.valid10,
};