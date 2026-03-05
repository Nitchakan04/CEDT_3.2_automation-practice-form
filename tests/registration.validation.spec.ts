// tests/registration.validation.spec.ts
import { test, expect, type Page } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";
import {
  REQUIRED_BASE,
  TEST_EMAILS,
  TEST_MOBILES,
  TEST_NAMES,
  TEST_FILES,
} from "../data/registration.data";

// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// test.afterEach(async () => {
//   await delay(2000);
// });

test.describe("Student Registration Form - Validation", () => {
  let reg: RegistrationPage;
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    reg = new RegistrationPage(page);
    await reg.goto();
  });

  async function expectPreventSubmit(invalidLocator: string) {
    await expect(reg.modalContent).toBeHidden();
    await expect(page.locator(invalidLocator)).toBeVisible();
  }

  async function closeModalIfVisible() {
    const closeBtn = page.locator("#closeLargeModal");
    if (await closeBtn.isVisible()) {
      await closeBtn.click({ force: true }); // กัน ads ทับ
      await expect(reg.modalContent).toBeHidden();
    }
  }


  test.describe("Required fields", () => {
    // All Pass
    test("TC01: First Name blank", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, firstName: "" });
      await reg.submit();
      await expectPreventSubmit("#firstName:invalid");
    });

    test("TC02: Last Name blank", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, lastName: "" });
      await reg.submit();
      await expectPreventSubmit("#lastName:invalid");
    });


    test("TC03: Gender blank", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, gender: undefined });
      await reg.submit();

      await expect(reg.modalContent).toBeHidden();
      await expect(page.locator('input[name="gender"]:invalid').first()).toBeVisible();
    });

    test("TC04: Mobile blank", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, mobile: "" });
      await reg.submit();
      await expectPreventSubmit("#userNumber:invalid");
    });
  });

  // Name format
  test.describe("Name format (Alphabetic only)", () => {
    // All Fail
    test("TC05: First Name numeric", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, firstName: TEST_NAMES.numeric });
      await reg.submit();
      await expectPreventSubmit("#firstName:invalid");
    });

    test("TC06: First Name special characters", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, firstName: TEST_NAMES.special });
      await reg.submit();
      await expectPreventSubmit("#firstName:invalid");
    });

    test("TC07: Last Name numeric", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, lastName: TEST_NAMES.numeric });
      await reg.submit();
      await expectPreventSubmit("#lastName:invalid");
    });

    test("TC08: Last Name special characters", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, lastName: TEST_NAMES.special });
      await reg.submit();
      await expectPreventSubmit("#lastName:invalid");
    });
  });

  // Mobile validation
  test.describe("Mobile validation", () => {
    // All Pass
    test("TC09: Mobile valid 10 digits", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, mobile: TEST_MOBILES.valid10 });
      await reg.submit();
      await reg.expectModalVisible();
      // await closeModalIfVisible();
    });

    test("TC10: Mobile invalid 9 digits", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, mobile: TEST_MOBILES.invalid9 });
      await reg.submit();
      await expectPreventSubmit("#userNumber:invalid");
    });

    test("TC11: Mobile invalid contains letters", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, mobile: TEST_MOBILES.invalidLetters });
      await reg.submit();
      await expectPreventSubmit("#userNumber:invalid");
    });

    test("TC12: Mobile invalid contains special symbols", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, mobile: TEST_MOBILES.invalidSymbols });
      await reg.submit();
      await expectPreventSubmit("#userNumber:invalid");
    });
  });

  // Email validation
  test.describe("Email validation", () => {
    test("TC13: Email valid (@gmail)", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, email: TEST_EMAILS.validBasic });
      await reg.submit();
      await reg.expectModalVisible();
      // await closeModalIfVisible();
    });
    // Pass

    test("TC14: Email valid (university subdomain)", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, email: TEST_EMAILS.validUniversity });
      await reg.submit();
      await reg.expectModalVisible();
      await closeModalIfVisible();
    });
    // Pass (ควรจะ fail)

    test("TC15: Email invalid (missing @)", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, email: TEST_EMAILS.invalidMissingAt });
      await reg.submit();
      await expectPreventSubmit("#userEmail:invalid");
    });
    // Pass

    test("TC16: Email invalid (missing domain extension)", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, email: TEST_EMAILS.invalidMissingTld });
      await reg.submit();
      await expectPreventSubmit("#userEmail:invalid");
    });
    // Pass
  });

  // Picture upload validation
  test.describe("Picture upload validation", () => {
    test("TC17: Upload JPG", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, picturePath: TEST_FILES.jpg });
      await reg.submit();
      await reg.expectModalVisible();
      // await closeModalIfVisible();
    });
    // Pass

    test("TC18: Upload PNG", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, picturePath: TEST_FILES.png });
      await reg.submit();
      await reg.expectModalVisible();
      // await closeModalIfVisible();
    });
    // Pass

    test("TC19: Upload PDF", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, picturePath: TEST_FILES.pdf });
      await reg.submit();

      await expect(reg.modalContent).toBeHidden();
      await expect(page.locator("#uploadPicture:invalid")).toBeVisible();
    });
    // Fail (pdf อัปโหลดได้ submit ได้ Modal ขึ้น )

    test("TC20: Upload TXT", async () => {
      await reg.fillForm({ ...REQUIRED_BASE, picturePath: TEST_FILES.txt });
      await reg.submit();
    
      await expect(reg.modalContent).toBeHidden();
      await expect(page.locator("#uploadPicture:invalid")).toBeVisible();
      // Fail (txt อัปโหลดได้ submit ได้ Modal ขึ้น )

    });
  });
});