import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: "load",
      timeout: 60000,
    });

    await this.page.waitForLoadState("networkidle");
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async fillText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toBeVisible();

    await locator.clear();

    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();

    return await locator.innerText();
  }

  async waitForElement(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForUrl(url: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async validateTitle(title: RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async hoverElement(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();

    await locator.hover();
  }

  async pressEnter(locator: Locator): Promise<void> {
    await locator.press("Enter");
  }

  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async selectDropdownOption(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();

    await locator.selectOption(value);
  }
  async closeGoogleVignetteIfPresent(): Promise<void> {
    const closeButton = this.page.locator('button[aria-label="Close"]');

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }
}
