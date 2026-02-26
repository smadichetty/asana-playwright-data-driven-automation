const { test, expect } = require('@playwright/test');
const testData = require('../test-data/webTestData.json');

test.describe('Web Application - Data Driven Automation Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(testData.baseURL);

    // Login
    await page.waitForSelector('#username', { timeout: 20000 });
    await page.fill('#username', testData.credentials.username);
    await page.fill('#password', testData.credentials.password);
    await page.click('button:has-text("Sign in")');

    // Wait for Web Application project to appear
    await page.waitForSelector('h2:has-text("Web Application")', { timeout: 20000 });
  });

  testData.testCases.forEach((scenario) => {

    test(scenario.testName, async ({ page }) => {

      // Click Web Application project
      await page.click(`button:has(h2:has-text("${scenario.projectName}"))`);

      // Locate column
      const column = page.locator('div.flex.flex-col.w-80', {
        has: page.locator(`h2:has-text("${scenario.columnName}")`)
      });
      await expect(column).toBeVisible();

      // Locate task card
      const taskCard = column.locator('div.bg-white', {
        has: page.locator(`h3:has-text("${scenario.taskName}")`)
      });
      await expect(taskCard).toBeVisible();

      // Validate tags
      if (scenario.tags && scenario.tags.length > 0) {
        for (const tag of scenario.tags) {
          await expect(taskCard.locator(`span:has-text("${tag}")`)).toBeVisible();
        }
      }

    });

  });

});