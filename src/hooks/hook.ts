import { Before, After, Status, setDefaultTimeout } from "@cucumber/cucumber";
setDefaultTimeout(60 * 1000);
import { chromium } from "playwright";

import { logger } from "../utils/logger";

import { CustomWorld } from "./world";

import fs from "fs";

Before(async function (this: CustomWorld) {
  logger.info("Launching browser");

  this.browser = await chromium.launch({
     headless: true,
  slowMo: 500,
  });

  this.context = await this.browser.newContext();

await this.context.route(
  /googlesyndication|doubleclick|googleads|adsystem|adsystem/i,

  async (route) => {

    await route.abort();
  },
);

  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
  });
 

  this.page = await this.context.newPage();

  logger.info("Browser launched successfully");

  
});

After(async function (this: CustomWorld, scenario) {

  logger.info(`Scenario Status: ${scenario.result?.status}`);

  if (scenario.result?.status === Status.FAILED) {

    logger.error("Scenario Failed");

    logger.error(`Scenario Name: ${scenario.pickle.name}`);

    logger.error(`Failure Message: ${scenario.result?.message}`);

    const screenshot = await this.page.screenshot({
      path: `screenshots/${scenario.pickle.name}.png`,
      type: "png",
    });

    await this.attach(screenshot, "image/png");

    const tracePath = `traces/${scenario.pickle.name}.zip`;

    await this.context.tracing.stop({
      path: tracePath,
    });

    const traceFile = fs.readFileSync(tracePath);

    await this.attach(traceFile, "application/zip");

  } else {

    await this.context.tracing.stop();
  }

  await this.page.close();

  await this.context.close();

  await this.browser.close();

  logger.info("Browser closed successfully");
});
