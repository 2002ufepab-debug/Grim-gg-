import { chromium } from "playwright";

const BASE_URL = "https://2002ufepab-debug.github.io/Grim-gg-/";
const failures = [];
const checks = [];
const check = (name, condition, detail = "") => {
  checks.push({ name, passed: Boolean(condition), detail });
  if (!condition) failures.push(`${name}${detail ? ": " + detail : ""}`);
};

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    permissions: ["clipboard-read", "clipboard-write"]
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  // A push can start this workflow before GitHub Pages finishes publishing. Reload until
  // the distinctive homepage revision marker is live, rather than testing stale HTML.
  let publishedRevision = false;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    await page.goto(BASE_URL + "?page=home&smoke=" + Date.now(), {
      waitUntil: "domcontentloaded", timeout: 60000
    });
    if (await page.locator(".hero-feature").count() > 0
      && (await page.locator(".hero-feature").innerText()).includes("HERO SPOTLIGHT / 001")) {
      publishedRevision = true;
      break;
    }
    await page.waitForTimeout(5000);
  }
  check("Latest homepage revision is published", publishedRevision,
    "waiting for the new hero spotlight to appear on GitHub Pages");
  if (!publishedRevision) throw new Error("GitHub Pages did not publish the expected homepage revision in time");

  await page.locator("#home").waitFor({ state: "visible", timeout: 20000 });
  check("Homepage renders", await page.locator("#home").isVisible());
  check("Main navigation exists", await page.locator("#nav a").count() >= 8);
  const spotlight = page.locator(".hero-feature");
  check("Homepage has a real hero spotlight", await spotlight.isVisible()
    && await page.locator(".hero-feature-name").innerText() === "CLINT");
  const spotlightImage = page.locator(".hero-feature-image");
  await spotlightImage.waitFor({ state: "visible", timeout: 20000 });
  await page.waitForFunction(() => {
    const image = document.querySelector(".hero-feature-image");
    return image && image.complete;
  }, { timeout: 30000 });
  check("Featured hero artwork loads", await spotlightImage.evaluate(image => image.naturalWidth > 0),
    await spotlightImage.getAttribute("src"));

  const routes = [
    ["heroes", "#heroes"],
    ["tierlist", "#tierlist"],
    ["items", "#items"],
    ["perks", "#perks"],
    ["talents", "#talentLab"],
    ["builds", "#builds"],
    ["favorites", "#favorites"],
    ["guides", "#guides"],
    ["esports", "#esports"]
  ];

  for (const [route, selector] of routes) {
    await page.goto(BASE_URL + "?page=" + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator(selector).waitFor({ state: "visible", timeout: 20000 });
    check("Route renders: " + route, await page.locator(selector).isVisible());
  }

  // Verify the hero and item search controls actually update their catalogs.
  await page.goto(BASE_URL + "?page=heroes", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#heroGrid").waitFor({ state: "visible", timeout: 20000 });
  await page.waitForFunction(() => {
    const text = document.querySelector("#heroGrid")?.innerText || "";
    return text.length > 0 && !/загружаем базу/i.test(text);
  }, { timeout: 20000 });
  const heroGridBefore = await page.locator("#heroGrid").innerText();
  await page.locator("#heroSearch").fill("Клинт");
  await page.waitForTimeout(350);
  const heroGridAfter = await page.locator("#heroGrid").innerText();
  check("Hero search responds", heroGridAfter !== heroGridBefore && /клинт/i.test(heroGridAfter),
    "searching for Клинт should narrow the hero catalog");

  await page.goto(BASE_URL + "?page=items", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#itemGrid").waitFor({ state: "visible", timeout: 20000 });
  await page.waitForFunction(() => (document.querySelector("#itemGrid")?.innerText || "").length > 0,
    { timeout: 20000 });
  const itemGridBefore = await page.locator("#itemGrid").innerText();
  await page.locator("#itemSearch").fill("Berserker");
  await page.waitForTimeout(350);
  const itemGridAfter = await page.locator("#itemGrid").innerText();
  check("Item search responds", itemGridAfter !== itemGridBefore && /berserker/i.test(itemGridAfter),
    "searching for Berserker should narrow the equipment catalog");

  // Talent planner: hero/role/style controls, expandable descriptions, reset and icon rendering.
  await page.goto(BASE_URL + "?page=talents", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#talentLab").waitFor({ state: "visible", timeout: 20000 });
  await page.locator(".talent-slot-toggle").first().waitFor({ state: "visible", timeout: 20000 });
  const talentButton = page.locator(".talent-slot-toggle").first();
  await talentButton.click();
  check("Talent descriptions expand", await talentButton.getAttribute("aria-expanded") === "true"
    && await page.locator("#talent-description-0").isVisible());
  await page.locator("#talentRole").selectOption({ label: "Убийца" });
  check("Talent role changes recommendations", await page.locator("#talentRole").inputValue() === "Убийца"
    && await page.locator(".talent-slot-toggle").count() === 3);
  await page.locator("#talentStyle").selectOption({ label: "Выживаемость" });
  check("Talent style control responds", await page.locator("#talentStyle").inputValue() === "Выживаемость");
  check("Talent icons have a visible real-image or fallback", await page.locator(".talent-icon").count() === 3
    && await page.locator(".talent-icon svg, .talent-icon img").count() >= 3);
  await page.locator("#talentReset").click();
  check("Talent reset restores defaults", await page.locator("#talentRole").inputValue() === "Стрелок"
    && await page.locator("#talentStyle").inputValue() === "Агрессивно");

  // Mobile navigation must open and close after a route is chosen.
  await page.goto(BASE_URL + "?page=home", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.setViewportSize({ width: 360, height: 800 });
  const menuToggle = page.locator("#menuToggle");
  await menuToggle.click();
  check("Mobile menu opens accessibly", await menuToggle.getAttribute("aria-expanded") === "true"
    && await page.locator("#nav").evaluate(node => node.classList.contains("open")));
  await page.locator("#nav a[href='?page=talents']").click();
  await page.locator("#talentLab").waitFor({ state: "visible", timeout: 20000 });
  check("Mobile navigation closes after selection", await menuToggle.getAttribute("aria-expanded") === "false"
    && !(await page.locator("#nav").evaluate(node => node.classList.contains("open"))));

  for (const route of ["home", "heroes", "talents", "items", "builds"]) {
    await page.goto(BASE_URL + "?page=" + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(250);
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    check("No horizontal overflow on mobile: " + route, dimensions.scrollWidth <= dimensions.width + 2,
      JSON.stringify(dimensions));
  }

  check("No uncaught JavaScript exceptions", pageErrors.length === 0, pageErrors.join(" | "));
  console.log(JSON.stringify({ result: failures.length ? "FAIL" : "PASS", checks, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
  await context.close();
} finally {
  await browser.close();
}
