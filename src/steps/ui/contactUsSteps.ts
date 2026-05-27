import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../hooks/world";
import { ContactUsPage } from "../../pages/ContactUsPage";

let contactUsPage: ContactUsPage;

When("user clicks on contact us link", async function (this: CustomWorld) {
  contactUsPage = new ContactUsPage(this.page);

  await contactUsPage.openContactUsPage();
});

When("user fills contact us form", async function () {
  await contactUsPage.fillContactForm();
});

When("user uploads attachment file", async function () {
  await contactUsPage.uploadAttachment();
});

When("user submits contact us form", async function () {
  await contactUsPage.submitForm();
});

Then("contact us success message should be visible", async function () {
  await contactUsPage.validateSuccessMessage();
});