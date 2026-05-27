import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",

  timeout: 60000,

  use: {
    baseURL: "https://www.automationexercise.com",

   headless: true,
  
    screenshot: "only-on-failure",

    trace: "retain-on-failure",

    video: "retain-on-failure"
  },

  reporter: [
    ["list"],
    ["allure-playwright"]
  ]
});