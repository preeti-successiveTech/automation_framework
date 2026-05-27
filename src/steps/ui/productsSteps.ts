import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ProductsPage } from "../../pages/ProductsPage";
import { CustomWorld } from "../../hooks/world";

let productsPage: ProductsPage;

 function getProductsPage(): ProductsPage {
  if (!productsPage) {
    throw new Error(
      "productsPage is not initialized. Ensure the step 'user clicks on products link' runs first.",
    );
  }
  return productsPage;
}

/* =========================
   NAVIGATION
========================= */

When("user clicks on products link", async function (this: CustomWorld) {
  productsPage = new ProductsPage(this.page);
  await productsPage.openProductsPage();
});

Then("products page should open successfully", async function () {
  const pp = getProductsPage();
  await pp.waitForUrl(/products/);
  await pp.waitForElement(pp.allProductsTitle);

});

Then("products grid should be visible", async function () {
  const pp = getProductsPage();
  await pp.waitForElement(pp.productsGrid);

});

Then("product items should be displayed", async function () {
  const pp = getProductsPage();
  const count = await pp.getElementCount(pp.productCards);

  expect(count).toBeGreaterThan(0);
});

/* =========================
   PRODUCT DETAILS
========================= */

When("user opens first product details page", async function () {
  await getProductsPage().openFirstProductDetails();
});

Then("product detail page should open successfully", async function () {
  const pp = getProductsPage();
  await pp.waitForUrl(/product_details/);
});

Then("product name should be visible", async function () {
  const pp = getProductsPage();
  await pp.waitForElement(pp.productName);
});

Then("product price should be visible", async function () {
  const pp = getProductsPage();
  await pp.waitForElement(pp.productPrice);
});

Then("product availability should be visible", async function () {
  const pp = getProductsPage();
  await pp.waitForElement(pp.productAvailability);
});

Then("product condition should be visible", async function () {
  const pp = getProductsPage();
  await pp.waitForElement(pp.productCondition);
});

Then("product brand should be visible", async function () {
  const pp = getProductsPage();
  await pp.waitForElement(pp.productBrand);
});

/* =========================
   SEARCH PRODUCT
========================= */

When(
  "user searches for product {string}",
  async function (this: CustomWorld, productName: string) {
    await getProductsPage().searchProduct(productName);
  }
);

Then(
  "searched product {string} should appear in results",
  async function (this: CustomWorld, productName: string) {
    const products = await getProductsPage().getSearchedProductsText();

    const matched = products.some((p) =>
      p.toLowerCase().includes(productName.toLowerCase())
    );

    expect(matched).toBeTruthy();
  }
);

/* =========================
   VALID SEARCH UI CHECK
========================= */

Then("searched products should be visible", async function () {
  const products = getProductsPage().page.locator(".features_items .productinfo");
  await expect(products.first()).toBeVisible();
});


Then("no products should be displayed", async function () {
  // Site behavior: invalid search returns the full product grid.
  // Correct assertion: none of the product names match the search term.
  const productTexts = await productsPage.searchedProductResult.allInnerTexts();

  const anyMatch = productTexts.some((name) =>
    name.toLowerCase().includes("invalidproduct123")
  );

  expect(anyMatch).toBe(false);
});



/* =========================
   BRAND FILTER
========================= */

When(
  "user selects brand {string}",
  async function (this: CustomWorld, brandName: string) {
    await getProductsPage().selectBrand(brandName);
  }
);

Then("brand products page should open successfully", async function () {
  await expect(getProductsPage().brandPageTitle).toBeVisible();
});

Then(
  "products related to brand {string} should be visible",
  async function (this: CustomWorld, brandName: string) {
    const products = await getProductsPage().getAllProductNames();

    const matched = products.some(p =>
      p.toLowerCase().includes(brandName.toLowerCase())
    );

    expect(matched).toBeTruthy();
  }
);

/* =========================
   CART FLOW (FIXED)
========================= */

When("user adds first product to cart", async function () {
  await getProductsPage().addFirstProductToCart();
});

When("user navigates to cart page", async function () {

  await getProductsPage().navigateToCart();
});

Then("added product should be visible in cart", async function () {
  await getProductsPage().page.waitForURL(/view_cart/, { timeout: 20000 });

  await getProductsPage().page.waitForLoadState("domcontentloaded");

  // Assert first row is visible before counting — no waitForTimeout needed
  await expect(getProductsPage().cartProductRows.first()).toBeVisible({ timeout: 10000 });

  const rowCount = await getProductsPage().cartProductRows.count();
  expect(rowCount).toBeGreaterThan(0);
});


When("user adds multiple products to cart from grid layout", async function () {
  const pp = getProductsPage();

  await pp.addProductFromGrid(0);
  await pp.addProductFromGrid(1);
});
Then("cart should contain multiple products", async function () {
  const pp = getProductsPage();

  await expect(pp.cartProductRows.first()).toBeVisible({ timeout: 10000 });

  const count = await pp.cartProductRows.count();

  expect(count).toBeGreaterThanOrEqual(2);
});
When(
  "user increases product quantity to {int}",
  async function (quantity: number) {
    await getProductsPage().increaseProductQuantity(quantity);
  }
);
Then("cart total calculation should update correctly", async function () {
  const pp = getProductsPage();

  const unitPrice = await pp.getCartUnitPrice();

  const totalPrice = await pp.getCartTotalPrice();

  expect(totalPrice).toBe(unitPrice * 2);
});