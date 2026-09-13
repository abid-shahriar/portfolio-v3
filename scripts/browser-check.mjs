import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  channel: process.platform === "win32" ? "msedge" : undefined,
  headless: true,
});
const errors = [];

try {
  for (const [name, width, height, mobile] of [
    ["desktop", 1440, 1000, false],
    ["phone", 390, 844, true],
    ["small-phone", 320, 740, true],
    ["tablet", 820, 1180, true],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: mobile,
      hasTouch: mobile,
      deviceScaleFactor: mobile ? 2 : 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);

    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `${name}: horizontal overflow`,
    );
    assert.equal(await page.locator("canvas").count(), 0, `${name}: 3D canvas should be removed`);
    assert.equal(await page.locator("h1").isVisible(), true);
    assert.equal(
      await page.locator(".site-header").evaluate((element) => getComputedStyle(element).position),
      "fixed",
    );

    if (width <= 820) {
      await page.locator(".menu-toggle").click();
      assert.equal(await page.locator("#mobile-nav").isVisible(), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#mobile-nav").isVisible(), false);
      await page.locator(".menu-toggle").click();
      await page.locator('#mobile-nav a[href="#skills"]').click();
      assert.equal(await page.locator("#mobile-nav").isVisible(), false);
      assert.ok(page.url().endsWith("#skills"));
    }

    const secondCareer = page.locator(".career").nth(1);
    await secondCareer.locator("summary").click();
    assert.equal(await secondCareer.getAttribute("open"), "");
    await secondCareer.locator("summary").click();
    assert.equal(await secondCareer.getAttribute("open"), null);

    const resume = await context.request.get(`${url}/public/ABID_SHAHRIAR_RESUME.pdf`);
    assert.equal(resume.status(), 200);
    assert.equal((await resume.body()).subarray(0, 5).toString(), "%PDF-");

    for (const element of await page.locator("[data-reveal]").all()) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(900);
    assert.equal(
      await page.locator("[data-reveal]").evaluateAll((elements) =>
        elements.every((element) => Number.parseFloat(getComputedStyle(element).opacity) > 0.95),
      ),
      true,
      `${name}: reveal content should settle visibly`,
    );

    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true, scale: "css" });
    console.log(`${name}: layout, navigation, experience, resume, and no-3D checks passed`);
    await context.close();
  }

  const reduced = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(url);
  assert.equal(
    await reducedPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    "auto",
  );
  await reduced.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJSPage = await noJS.newPage();
  await noJSPage.goto(url);
  assert.equal(await noJSPage.locator(".about-copy").isVisible(), true);
  await noJS.close();

  assert.deepEqual(errors, []);
  console.log("Reduced-motion, no-JavaScript content, and runtime error checks passed.");
} finally {
  await browser.close();
}
