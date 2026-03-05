// pages/RegistrationPage.ts
import { expect, Locator, Page } from "@playwright/test";
import { BASE_URL } from "../data/registration.data";
import path from "path";

export type Gender = "Male" | "Female" | "Other";
export type Hobby = "Sports" | "Reading" | "Music";

export type RegistrationData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: Gender;
  mobile?: string;

  dob?: { day: number; month: number; year: number };

  subjects?: string[];
  hobbies?: Hobby[];
  picturePath?: string;
  address?: string;

  state?: string;
  city?: string;
};

export class RegistrationPage {
  readonly page: Page;

  // Inputs
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly mobile: Locator;
  readonly dobInput: Locator;
  readonly subjectsInput: Locator;
  readonly uploadPicture: Locator;
  readonly address: Locator;
  readonly submitBtn: Locator;

  // State/City (react-select)
  readonly stateContainer: Locator;
  readonly cityContainer: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;

  // Modal
  readonly modalRoot: Locator;
  readonly modalContent: Locator;
  readonly modalTitle: Locator;
  readonly modalCloseBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstName = page.locator("#firstName");
    this.lastName = page.locator("#lastName");
    this.email = page.locator("#userEmail");
    this.mobile = page.locator("#userNumber");
    this.dobInput = page.locator("#dateOfBirthInput");
    this.subjectsInput = page.locator("#subjectsInput");
    this.uploadPicture = page.locator("#uploadPicture");
    this.address = page.locator("#currentAddress");
    this.submitBtn = page.locator("#submit");

    this.stateContainer = page.locator("#state");
    this.cityContainer = page.locator("#city");
    this.stateInput = page.locator("#react-select-3-input");
    this.cityInput = page.locator("#react-select-4-input");

    this.modalRoot = page.locator(".modal");
    this.modalContent = page.locator(".modal-content");
    this.modalTitle = page.locator("#example-modal-sizes-title-lg");
    this.modalCloseBtn = page.locator("#closeLargeModal");
  }

  // Navigation
  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await expect(this.page.getByText("Student Registration Form")).toBeVisible();
    await this.makePageStableForClicking();
  }

  async makePageStableForClicking() {
    await this.page.addStyleTag({
      content: `#fixedban, footer, iframe { display:none !important; }`,
    });
  }

  // Fill form
  async fillForm(data: RegistrationData) {
    if (data.firstName !== undefined) await this.firstName.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastName.fill(data.lastName);
    if (data.email !== undefined) await this.email.fill(data.email);
    if (data.gender !== undefined) await this.selectGender(data.gender);
    if (data.mobile !== undefined) await this.mobile.fill(data.mobile);

    if (data.dob) await this.setDobByCalendar(data.dob.day, data.dob.month, data.dob.year);

    if (data.subjects?.length) await this.addSubjects(data.subjects);

    if (data.hobbies?.length) {
      for (const h of data.hobbies) await this.selectHobby(h);
    }

    if (data.picturePath) await this.uploadPicture.setInputFiles(data.picturePath);

    if (data.address !== undefined) await this.address.fill(data.address);

    // dynamic dropdown (เลือก state ก่อน city)
    if (data.state) await this.selectState(data.state);
    if (data.city) await this.selectCity(data.city);
  }

  // Gender / Hobby
  private genderSel(g: Gender) {
    return g === "Male" ? "#gender-radio-1" : g === "Female" ? "#gender-radio-2" : "#gender-radio-3";
  }
  private hobbySel(h: Hobby) {
    return h === "Sports" ? "#hobbies-checkbox-1" : h === "Reading" ? "#hobbies-checkbox-2" : "#hobbies-checkbox-3";
  }

  async selectGender(g: Gender) {
    const sel = this.genderSel(g);
    await this.page.locator(sel).scrollIntoViewIfNeeded();
    await this.page.evaluate((s) => {
      const el = document.querySelector(s) as HTMLInputElement | null;
      if (!el) throw new Error("Gender not found: " + s);
      if (!el.checked) el.click();
    }, sel);
  }

  async selectHobby(h: Hobby) {
    const sel = this.hobbySel(h);
    await this.page.locator(sel).scrollIntoViewIfNeeded();
    await this.page.evaluate((s) => {
      const el = document.querySelector(s) as HTMLInputElement | null;
      if (!el) throw new Error("Hobby not found: " + s);
      if (!el.checked) el.click();
    }, sel);
  }

  // Subjects
  async addSubjects(subjects: string[]) {
    for (const s of subjects) {
      await this.subjectsInput.scrollIntoViewIfNeeded();
      await this.subjectsInput.click({ force: true });
      await this.subjectsInput.fill(s);

      const opt = this.page.locator(".subjects-auto-complete__option").filter({ hasText: s }).first();
      await expect(opt).toBeVisible();
      await opt.click();

      await this.page.keyboard.press("Escape");
    }
  }

  async subjectTagCount(): Promise<number> {
    return await this.page.locator(".subjects-auto-complete__multi-value").count();
  }

  async expectSubjectsTags(subjects: string[]) {
    for (const s of subjects) {
      await expect(this.page.locator(".subjects-auto-complete__multi-value").filter({ hasText: s })).toBeVisible();
    }
  }

  async removeSubjectTagByName(subject: string) {
    const tag = this.page.locator(".subjects-auto-complete__multi-value").filter({ hasText: subject }).first();
    await expect(tag).toBeVisible();
    await tag.locator(".subjects-auto-complete__multi-value__remove").click();
    await expect(this.page.locator(".subjects-auto-complete__multi-value").filter({ hasText: subject })).toHaveCount(0);
  }

  // DOB 
  async getDobValue(): Promise<string> {
    return await this.dobInput.inputValue();
  }

  async expectDobDefaultToday() {
    const expected = await this.page.evaluate(() => {
      const d = new Date();
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    });
    await expect(this.dobInput).toHaveValue(expected);
  }

  async setDobByCalendar(day: number, month: number, year: number) {
    await this.dobInput.click();
    await this.page.locator(".react-datepicker__month-select").selectOption(String(month - 1));
    await this.page.locator(".react-datepicker__year-select").selectOption(String(year));

    const dd = String(day).padStart(2, "0");
    await this.page
      .locator(`.react-datepicker__day--0${dd}:not(.react-datepicker__day--outside-month)`)
      .first()
      .click();

    await expect(this.page.locator(".react-datepicker")).toBeHidden();
  }

  // Dynamic Dropdown: State -> City
  async isCityDisabled(): Promise<boolean> {
    const disabled = await this.cityInput.getAttribute("disabled");
    return disabled !== null;
  }

  async expectCityDisabledOrEmptyBeforeState() {
    const disabled = await this.isCityDisabled();
    if (disabled) return;

    await this.cityContainer.click({ force: true });
    await expect(this.page.locator('div[id^="react-select-4-option-"]')).toHaveCount(0);
  }

  async selectState(state: string) {
    await this.stateContainer.scrollIntoViewIfNeeded();
    await this.stateContainer.click({ force: true });

    const stateOpt = this.page.locator("div[id^='react-select-3-option-']").filter({ hasText: state }).first();
    await expect(stateOpt).toBeVisible();
    await stateOpt.click();

    await expect(this.stateContainer).toContainText(new RegExp(state, "i"));
  }

  async selectCity(city: string) {
    await this.cityContainer.scrollIntoViewIfNeeded();
    await this.cityContainer.click({ force: true });

    const cityOpt = this.page.locator("div[id^='react-select-4-option-']").filter({ hasText: city }).first();
    await expect(cityOpt).toBeVisible();
    await cityOpt.click();

    await expect(this.cityContainer).toContainText(new RegExp(city, "i"));
  }

  async getVisibleCityOptions(): Promise<string[]> {
    await this.cityContainer.click({ force: true });
    return await this.page.locator('div[id^="react-select-4-option-"]').allTextContents();
  }

  async expectCityOptionsContainOnly(expectedCity: string, notExpectedCity?: string) {
    const list = (await this.getVisibleCityOptions()).join(" ");
    expect(list).toContain(expectedCity);
    if (notExpectedCity) expect(list).not.toContain(notExpectedCity);
  }

  // Submit + Modal
  async submit() {
    await this.makePageStableForClicking();
    await this.submitBtn.scrollIntoViewIfNeeded();
    await this.submitBtn.click({ force: true });
  }

  async expectModalVisible() {
    await expect(this.modalContent).toBeVisible();
    await expect(this.modalTitle).toBeVisible();
  }

  async expectModalTitle(expected: string) {
    await expect(this.modalTitle).toHaveText(expected);
  }

  async closeModalAndWaitGone() {
    await this.modalCloseBtn.scrollIntoViewIfNeeded();
    await this.modalCloseBtn.click({ force: true });
    await expect(this.modalRoot).toBeHidden({ timeout: 8000 });
  }

  async getModalValue(label: string): Promise<string> {
    const row = this.page.locator("table.table tbody tr").filter({
      has: this.page.locator("td").first().filter({ hasText: label }),
    });
    await expect(row).toBeVisible();
    return (await row.locator("td").nth(1).innerText()).trim();
  }

  async expectModalMatchesData(data: Required<RegistrationData>) {
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];

    const dobText = `${String(data.dob.day).padStart(2, "0")} ${months[data.dob.month - 1]},${data.dob.year}`;
    const pictureName = path.basename(data.picturePath);

    expect(await this.getModalValue("Student Name")).toBe(`${data.firstName} ${data.lastName}`);
    expect(await this.getModalValue("Student Email")).toBe(data.email);
    expect(await this.getModalValue("Gender")).toBe(data.gender);
    expect(await this.getModalValue("Mobile")).toBe(data.mobile);

    expect(await this.getModalValue("Date of Birth")).toBe(dobText);
    expect(await this.getModalValue("Subjects")).toBe(data.subjects.join(", "));
    expect(await this.getModalValue("Hobbies")).toBe(data.hobbies.join(", "));
    expect(await this.getModalValue("Picture")).toBe(pictureName);
    expect(await this.getModalValue("Address")).toBe(data.address);
    expect(await this.getModalValue("State and City")).toBe(`${data.state} ${data.city}`);
  }

  async expectFormIsBlank() {
    await expect(this.firstName).toHaveValue("");
    await expect(this.lastName).toHaveValue("");
    await expect(this.email).toHaveValue("");
    await expect(this.mobile).toHaveValue("");
    await expect(this.address).toHaveValue("");

    await expect(this.stateContainer).not.toContainText(/NCR|Uttar/i);
    await expect(this.cityContainer).not.toContainText(/Delhi|Lucknow/i);
  }
}