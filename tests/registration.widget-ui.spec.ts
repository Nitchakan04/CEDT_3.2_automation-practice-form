import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.afterEach(async () => {
  await delay(2000);
});

test.describe("Student Registration Form (Midterm) - Widget & UI", () => {
  // DOB widget
  test("TC11: DOB default is current system date", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    const v = await reg.getDobValue();
    expect(v).toMatch(/^\d{2}\s[A-Za-z]{3}\s\d{4}$/);
  });

  test("TC12: Can select DOB via calendar widget", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.setDobByCalendar(5, 3, 2006);
    await expect(reg.dobInput).toHaveValue(/05\sMar\s2006|05\sMarch\s2006/i);
  });

  // Dynamic + Subjects tags
  test("TC13: City disabled until State + Subjects tags removable", async ({
    page,
  }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    expect(await reg.isCityDisabled()).toBeTruthy();

    await reg.selectStateCity("NCR", "Delhi");

    await reg.addSubjects(["Maths", "Physics"]);
    expect(await reg.subjectTagCount()).toBe(2);

    await reg.removeFirstSubjectTag();
    expect(await reg.subjectTagCount()).toBe(1);
  });
});