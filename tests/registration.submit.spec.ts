// tests/registration.submit.spec.ts
import { test } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";
import { VALID_DATA } from "../data/registration.data";

test.describe("Student Registration Form - Submit & Modal", () => {
  test("TC01: Submit success", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm(VALID_DATA);
    await reg.submit();

    await reg.expectModalVisible();
    await reg.expectModalTitle("Thanks for submitting the form");

    await reg.expectModalMatchesData(VALID_DATA as Required<typeof VALID_DATA>);
    // Pass
  });

  test("TC02: Close modal and returns to blank form", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm(VALID_DATA);
    await reg.submit();

    await reg.expectModalVisible();
    await reg.closeModalAndWaitGone();

    await reg.expectFormIsBlank();
    // Fail
  });
});
