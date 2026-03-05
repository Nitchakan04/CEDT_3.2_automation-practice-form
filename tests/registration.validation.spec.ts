import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";
import { REQUIRED_BASE } from "../data/registration.data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.afterEach(async () => {
  await delay(2000);
});

test.describe("Student Registration Form - Validation", () => {
  // Required fields
  test("TC02: Required - First Name blank", async ({
    page,
  }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, firstName: "" });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator("#firstName:invalid")).toBeVisible();
  });

  test("TC03: Required - Last Name blank", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, lastName: "" });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator("#lastName:invalid")).toBeVisible();
  });

  test("TC04: Required - Gender blank", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, gender: undefined });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(
      page.locator('input[name="gender"]:invalid').first(),
    ).toBeVisible();
  });

  test("TC05: Required - Mobile blank", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, mobile: "" });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator("#userNumber:invalid")).toBeVisible();
  });

  // Mobile validation
  test("TC06: Mobile valid 10 digits", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, mobile: "0812345678" });
    await reg.submit();

    await reg.expectModalVisible();
  });

  test("TC07: Mobile invalid 9 digits", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, mobile: "081234567" });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator("#userNumber:invalid")).toBeVisible();
  });

  test("TC08: Mobile invalid contains letters", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, mobile: "0812345abc" });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator("#userNumber:invalid")).toBeVisible();
  });

  // Email validation
  test("TC09: Email valid", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, email: "name@example.com" });
    await reg.submit();

    await reg.expectModalVisible();
  });

  test("TC10: Email invalid (missing @)", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.goto();

    await reg.fillForm({ ...REQUIRED_BASE, email: "nameexample.com" });
    await reg.submit();

    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator("#userEmail:invalid")).toBeVisible();
  });
});