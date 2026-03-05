import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";
import { VALID_DATA } from "../data/registration.data";
import path from "path";

const pictureName = path.basename(VALID_DATA.picturePath!);
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.afterEach(async () => {
  await delay(2000);
});

test.describe("Student Registration Form (Midterm) - Submit Success", () => {
  test("TC01: Submit success", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm(VALID_DATA);
    await reg.submit();

    await reg.expectModalVisible();
    await reg.expectModalTitle("Thanks for submitting the form");

    // เช็คว่า data ที่กรอกไป แสดงบนตาราง
    expect(await reg.getModalValue("Student Name")).toBe(
      `${VALID_DATA.firstName} ${VALID_DATA.lastName}`,
    );
    expect(await reg.getModalValue("Student Email")).toBe(VALID_DATA.email!);
    expect(await reg.getModalValue("Gender")).toBe(VALID_DATA.gender!);
    expect(await reg.getModalValue("Mobile")).toBe(VALID_DATA.mobile!);

    expect(await reg.getModalValue("Subjects")).toBe(
      VALID_DATA.subjects!.join(", "),
    );
    expect(await reg.getModalValue("Hobbies")).toBe(
      VALID_DATA.hobbies!.join(", "),
    );

    expect(await reg.getModalValue("Picture")).toBe(pictureName);
    expect(await reg.getModalValue("Address")).toBe(VALID_DATA.address!);
    expect(await reg.getModalValue("State and City")).toBe(
      `${VALID_DATA.state} ${VALID_DATA.city}`,
    );
  });
});