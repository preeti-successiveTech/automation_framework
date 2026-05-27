import { Locator, Page, expect } from "@playwright/test";
import path from "path";
import { BasePage } from "./BasePage";

export class ContactUsPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly uploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly contactUsLink: Locator;
  readonly homeButton: Locator;
  constructor(page: Page) {
    super(page);

    this.contactUsLink = page.getByRole("link", {
      name: "Contact us",
    });

    this.nameInput = page.locator('input[data-qa="name"]');

    this.emailInput = page.locator('input[data-qa="email"]');

    this.subjectInput = page.locator('input[data-qa="subject"]');

    this.messageInput = page.locator('textarea[data-qa="message"]');

    this.uploadInput = page.locator('input[name="upload_file"]');

    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator("#contact-page div.status.alert.alert-success")
    this.homeButton = page.locator('div#form-section a[href="/"]');
  }

  async openContactUsPage(): Promise<void> {
    await this.clickElement(this.contactUsLink);

    await this.waitForUrl(/contact_us/);
  }

  async fillContactForm(): Promise<void> {
    await this.fillText(this.nameInput, "Preeti Garg");

    await this.fillText(this.emailInput, "preeti@gmail.com");

    await this.fillText(this.subjectInput, "Automation Testing");

    await this.fillText(
      this.messageInput,
      "Playwright automation contact us validation",
    );
  }

  async uploadAttachment(): Promise<void> {
    const filePath = path.join(process.cwd(), "src/test-data/sample.txt");

    await this.uploadInput.setInputFiles(filePath);
  }

async submitForm(): Promise<void> {

  this.page.once("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.accept();
  });

  await this.submitButton.click({
    force: true,
  });

  await this.page.waitForLoadState("networkidle");

  await this.page.waitForTimeout(3000);
}
  async validateSuccessMessage(): Promise<void> {
  await expect(
  this.successMessage).toHaveText(
  "Success! Your details have been submitted successfully."
);
    await expect(this.homeButton).toBeVisible();
  }
}
