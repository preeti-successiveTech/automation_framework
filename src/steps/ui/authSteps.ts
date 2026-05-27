import { Then, When } from "@cucumber/cucumber";

import { expect } from "@playwright/test";

import { HomePage } from "../../pages/HomePage";

import { LoginPage } from "../../pages/LoginPage";

import { CustomWorld } from "../../hooks/world";
import { generateUserData, UserData } from "../../utils/fakerUtils";
import { createdUser, setCreatedUser } from "../../utils/testDataStore";
let homePage: HomePage;
let userData: UserData;
let loginPage: LoginPage;

When("user clicks on signup login link", async function (this: CustomWorld) {
  homePage = new HomePage(this.page);

  await homePage.clickSignupLogin();

  loginPage = new LoginPage(this.page);
});

Then("login page should open successfully", async function (this: CustomWorld) {
  await loginPage.waitForUrl(/login/);

  await loginPage.validateTitle(/Automation Exercise/);
});

Then("login form should be visible", async function (this: CustomWorld) {
  await loginPage.waitForElement(loginPage.loginHeading);

  await loginPage.waitForElement(loginPage.loginEmailInput);

  await loginPage.waitForElement(loginPage.loginPasswordInput);

  await loginPage.waitForElement(loginPage.loginButton);
});

Then("signup form should be visible", async function (this: CustomWorld) {
  await loginPage.waitForElement(loginPage.signupHeading);

  await loginPage.waitForElement(loginPage.signupNameInput);

  await loginPage.waitForElement(loginPage.signupEmailInput);

  await loginPage.waitForElement(loginPage.signupButton);
});
When(
  "user registers with dynamic credentials",
  async function (this: CustomWorld) {
    userData = generateUserData();
    setCreatedUser(userData);

    await loginPage.registerNewUser(
      userData.name,

      userData.email,

      userData.password,
    );
  },
);
Then(
  "account should be created successfully",
  async function (this: CustomWorld) {
    await loginPage.waitForElement(loginPage.accountCreatedMessage);

    await loginPage.clickElement(loginPage.continueButton);
  },
);
Then(
  "logged in username should be visible",
  async function (this: CustomWorld) {
    await loginPage.waitForElement(loginPage.loggedInUser);

    await expect(loginPage.loggedInUser).toContainText(userData.name);
  },
);
When("user logs in with valid credentials", async function (this: CustomWorld) {
  await loginPage.loginUser(
    createdUser.email,

    createdUser.password,
  );
});
Then("logout button should be visible", async function (this: CustomWorld) {
  await loginPage.waitForElement(loginPage.logoutLink);
});
When(
  "user logs in with invalid credentials",
  async function (this: CustomWorld) {
    await loginPage.loginWithInvalidCredentials();
  },
);
Then(
  "login error message should be visible",
  async function (this: CustomWorld) {
    await loginPage.waitForElement(loginPage.loginErrorMessage);

    await expect(loginPage.loginErrorMessage).toContainText(
      "Your email or password is incorrect!",
    );
  },
);
Then("user should remain on login page", async function (this: CustomWorld) {
  await loginPage.waitForUrl(/login/);
});
When("user clicks logout button", async function (this: CustomWorld) {
  await loginPage.logoutUser();
});
Then(
  "user should be redirected to login page",
  async function (this: CustomWorld) {
    await loginPage.waitForUrl(/login/);
  },
);
Then(
  "logged in username should not be visible",
  async function (this: CustomWorld) {
    await expect(loginPage.loggedInUser).not.toBeVisible();
  },
);
