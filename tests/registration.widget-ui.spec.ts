// tests/registration.widget-ui.spec.ts
import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";
import {
  TEST_DOB,
  TEST_STATE_CITY,
  TEST_SUBJECTS,
} from "../data/registration.data";

test.describe("Student Registration Form - Widget & UI", () => {
  // All Pass
  test("TC01: DOB default is today's system date", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();
    await reg.expectDobDefaultToday();
  });

  test("TC02: DOB can be selected via calendar widget", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    const dob = TEST_DOB.example;
    await reg.setDobByCalendar(dob.day, dob.month, dob.year);

    await expect(reg.dobInput).toHaveValue(
      new RegExp(
        `${String(dob.day).padStart(2, "0")}\\s+(Mar|March)\\s+${dob.year}`,
        "i",
      ),
    );
  });

  test("TC03: City is disabled/empty until State is selected", async ({
    page,
  }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();
    await reg.expectCityDisabledOrEmptyBeforeState();
  });

  test("TC04: City changes by State (filtered options)", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.selectState(TEST_STATE_CITY.NCR.state);
    await reg.expectCityOptionsContainOnly(
      TEST_STATE_CITY.NCR.city,
      TEST_STATE_CITY.UP.city,
    );

    await reg.selectState(TEST_STATE_CITY.UP.state);
    await reg.expectCityOptionsContainOnly(
      TEST_STATE_CITY.UP.city,
      TEST_STATE_CITY.NCR.city,
    );
  });

  test("TC05: Subjects multi-entry", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.addSubjects(TEST_SUBJECTS.three);

    expect(await reg.subjectTagCount()).toBe(TEST_SUBJECTS.three.length);
    await reg.expectSubjectsTags(TEST_SUBJECTS.three);

    await reg.removeSubjectTagByName(TEST_SUBJECTS.three[0]);
    expect(await reg.subjectTagCount()).toBe(TEST_SUBJECTS.three.length - 1);
  });
});
