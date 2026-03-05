// data/registration.data.ts
import path from "path";
import type { RegistrationData } from "../pages/RegistrationPage";

export const BASE_URL = "https://demoqa.com/automation-practice-form";

export const SAMPLE_PICTURE = path.resolve(
  process.cwd(),
  "picture",
  "sample.png",
);

export const VALID_DATA: RegistrationData = {
  firstName: "Nitchakan",
  lastName: "K",
  email: "name@example.com",
  gender: "Female",
  mobile: "0812345678",

  subjects: ["Maths", "Physics"],
  hobbies: ["Sports", "Reading"],
  picturePath: SAMPLE_PICTURE,
  address: "Bangkok, Thailand",
  state: "NCR",
  city: "Delhi",
};

export const REQUIRED_BASE: RegistrationData = {
  firstName: "Nitchakan",
  lastName: "K",
  gender: "Female",
  mobile: "0812345678",
};