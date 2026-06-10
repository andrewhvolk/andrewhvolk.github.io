#!/usr/bin/env node
/* Browser QA for every generated lecture session and chooser at four sizes. */

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const lectureDir = path.join(root, "lectures");
const output = path.join(root, "migration", "browser-qa");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "components"), { recursive: true });

const manifests = fs.readdirSync(lectureDir)
  .filter((name) => /^Math130Unit.+\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(lectureDir, name), "utf8")));

const pages = [];
for (const manifest of manifests) {
  for (const session of manifest.sessions) {
    pages.push({ file: session.output, kind: "session", expectedSlides: session.blocks.length });
  }
  if (manifest.deck.chooser_output) {
    pages.push({
      file: manifest.deck.chooser_output,
      kind: "chooser",
      expectedLinks: manifest.sessions.map((session) => session.output),
    });
  }
}

const viewports = [
  { name: "projector", width: 1600, height: 900 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "tablet", width: 1024, height: 768, hasTouch: true },
  { name: "phone", width: 390, height: 844, hasTouch: true, isMobile: true },
];

const capturedComponents = new Set();
const capturedAuditSamples = new Set();
const auditSamples = {
  "math130unit2b-u2b-graphs-model": "corrected-log-graph",
  "math130unit3c-u3c-model-model": "corrected-ladder-model",
  "math130unit3d-u3d-direction-model": "corrected-vector-direction",
  "math130unit2a-u2a-graph-synthesize": "pacing-checkpoint",
};

async function openPage(browser, spec, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.hasTouch),
    isMobile: Boolean(viewport.isMobile),
    serviceWorkers: "block",
  });
  await context.setOffline(true);
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  const externalRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    if (/^https?:/i.test(request.url())) externalRequests.push(request.url());
  });
  page.on("requestfailed", (request) => {
    requestFailures.push(`${request.url()}: ${request.failure()?.errorText || "failed"}`);
  });
  await page.goto(pathToFileURL(path.join(root, spec.file)).href, { waitUntil: "load" });
  await page.waitForTimeout(spec.kind === "session" ? 850 : 100);
  return { context, page, consoleErrors, requestFailures, externalRequests };
}

async function inspectChooser(browser, spec, viewport) {
  const state = await openPage(browser, spec, viewport);
  const { page } = state;
  const hrefs = await page.locator(".session-link").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href"))
  );
  const bodyOverflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    width: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  if (viewport.name === "projector") {
    await page.screenshot({
      path: path.join(output, `${path.basename(spec.file, ".html")}-${viewport.name}.png`),
      fullPage: false,
    });
  }
  await state.context.close();
  return {
    page: spec.file,
    kind: spec.kind,
    viewport: viewport.name,
    dimensions: `${viewport.width}x${viewport.height}`,
    linksPass: spec.expectedLinks.every((link) => hrefs.includes(link)),
    bodyOverflow,
    consoleErrors: state.consoleErrors,
    requestFailures: state.requestFailures,
    externalRequests: state.externalRequests,
  };
}

async function inspectSession(browser, spec, viewport) {
  const state = await openPage(browser, spec, viewport);
  const { page } = state;
  const slideCount = await page.locator(".reveal .slides > section").count();
  const navCount = await page.locator(".slide-nav li").count();
  const overflow = [];
  for (let index = 0; index < slideCount; index += 1) {
    await page.evaluate((slideIndex) => window.Reveal.slide(slideIndex), index);
    await page.waitForTimeout(12);
    const result = await page.locator(".reveal .slides > section").nth(index).evaluate((section) => ({
      title: section.dataset.title || "",
      component: section.dataset.component || "",
      blockId: section.dataset.blockId || "",
      scrollWidth: section.scrollWidth,
      clientWidth: section.clientWidth,
      scrollHeight: section.scrollHeight,
      clientHeight: section.clientHeight,
    }));
    if (result.scrollWidth > result.clientWidth + 4 || result.scrollHeight > result.clientHeight + 4) {
      overflow.push({ slide: index + 1, ...result });
    }
    if (viewport.name === "projector" && result.component &&
        !capturedComponents.has(result.component)) {
      capturedComponents.add(result.component);
      await page.evaluate((slideIndex) => window.Reveal.slide(slideIndex, 0, 999), index);
      await page.waitForTimeout(550);
      await page.screenshot({
        path: path.join(output, "components", `${result.component}.png`),
        fullPage: false,
      });
    }
    if (viewport.name === "projector" && auditSamples[result.blockId] &&
        !capturedAuditSamples.has(result.blockId)) {
      capturedAuditSamples.add(result.blockId);
      await page.evaluate((slideIndex) => window.Reveal.slide(slideIndex, 0, 999), index);
      await page.waitForTimeout(550);
      await page.screenshot({
        path: path.join(output, `${auditSamples[result.blockId]}.png`),
        fullPage: false,
      });
    }
  }

  const interactionFailures = [];
  if (viewport.name === "projector") {
    const toggleCount = await page.locator("[data-answer-toggle]").count();
    for (let index = 0; index < toggleCount; index += 1) {
      const toggle = page.locator("[data-answer-toggle]").nth(index);
      const slideIndex = await toggle.evaluate((button) =>
        Array.from(document.querySelectorAll(".reveal .slides > section"))
          .indexOf(button.closest("section"))
      );
      await page.evaluate((target) => window.Reveal.slide(target), slideIndex);
      const targetId = await toggle.getAttribute("data-answer-toggle");
      await toggle.click();
      if (!(await page.locator(`#${targetId}`).isVisible())) {
        interactionFailures.push(`answer ${targetId} did not reveal`);
      }
      await page.locator(".classroom-toolbar button").filter({ hasText: "Reset slide" }).click();
      if (!(await page.locator(`#${targetId}`).isHidden())) {
        interactionFailures.push(`answer ${targetId} did not reset`);
      }
    }

    if (slideCount > 1) {
      await page.evaluate(() => window.Reveal.slide(0));
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(60);
      const index = await page.evaluate(() => window.Reveal.getIndices().h);
      if (index !== 1) interactionFailures.push("keyboard navigation did not advance");
    }

    const derivation = page.locator('[data-component="derivation"]').first();
    if (await derivation.count()) {
      const slideIndex = await derivation.evaluate((section) =>
        Array.from(document.querySelectorAll(".reveal .slides > section")).indexOf(section)
      );
      await page.evaluate((target) => window.Reveal.slide(target, 0, -1), slideIndex);
      const fragments = derivation.locator(".fragment");
      if ((await fragments.count()) && !(await page.evaluate(() => window.Reveal.nextFragment()))) {
        interactionFailures.push("staged derivation fragment did not advance");
      }
    }
  }

  if (viewport.hasTouch) {
    await page.evaluate(() => window.Reveal.slide(0));
    await page.locator(".navigate-right").tap();
    await page.waitForTimeout(60);
    const touchIndex = await page.evaluate(() => window.Reveal.getIndices().h);
    if (slideCount > 1 && touchIndex !== 1) {
      interactionFailures.push("touch navigation did not advance");
    }
  }

  if (viewport.name === "projector") {
    await page.evaluate(() => window.Reveal.slide(0));
    await page.waitForTimeout(550);
    await page.screenshot({
      path: path.join(output, `${path.basename(spec.file, ".html")}-${viewport.name}.png`),
      fullPage: false,
    });
  }
  await state.context.close();
  return {
    page: spec.file,
    kind: spec.kind,
    viewport: viewport.name,
    dimensions: `${viewport.width}x${viewport.height}`,
    slideCount,
    slideCountPass: slideCount === spec.expectedSlides,
    navCount,
    navPass: navCount === slideCount,
    overflow,
    interactionFailures,
    consoleErrors: state.consoleErrors,
    requestFailures: state.requestFailures,
    externalRequests: state.externalRequests,
  };
}

function problemCount(result) {
  if (result.kind === "chooser") {
    return (result.linksPass ? 0 : 1) + (result.bodyOverflow.horizontal ? 1 : 0) +
      result.consoleErrors.length + result.requestFailures.length + result.externalRequests.length;
  }
  return (result.slideCountPass ? 0 : 1) + (result.navPass ? 0 : 1) +
    result.overflow.length + result.interactionFailures.length + result.consoleErrors.length +
    result.requestFailures.length + result.externalRequests.length;
}

(async () => {
  const executablePath = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((candidate) => fs.existsSync(candidate));
  if (!executablePath) throw new Error("Chrome or Microsoft Edge is required for browser QA.");
  const browser = await chromium.launch({ headless: true, executablePath });
  const results = [];
  for (const spec of pages) {
    for (const viewport of viewports) {
      results.push(spec.kind === "session"
        ? await inspectSession(browser, spec, viewport)
        : await inspectChooser(browser, spec, viewport));
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(results, null, 2));

  const expectedComponents = [
    "title", "chapter", "roadmap", "concept", "formula", "derivation", "diagram",
    "comparison", "decision", "worked-example", "practice", "misconception", "poll", "summary",
  ];
  const missingComponents = expectedComponents.filter((name) => !capturedComponents.has(name));
  const missingAuditSamples = Object.keys(auditSamples)
    .filter((blockId) => !capturedAuditSamples.has(blockId));
  let failures = missingComponents.length + missingAuditSamples.length;
  if (missingComponents.length) {
    console.log(`FAIL representative component screenshots missing: ${missingComponents.join(", ")}`);
  }
  if (missingAuditSamples.length) {
    console.log(`FAIL audit screenshots missing: ${missingAuditSamples.join(", ")}`);
  }
  for (const result of results) {
    const problems = problemCount(result);
    failures += problems;
    const detail = result.kind === "session"
      ? `slides=${result.slideCount} overflow=${result.overflow.length} interactions=${result.interactionFailures.length}`
      : `links=${result.linksPass ? "pass" : "fail"} overflow=${result.bodyOverflow.horizontal ? 1 : 0}`;
    console.log(`${problems ? "FAIL" : "PASS"} ${result.page} ${result.viewport} ${detail} ` +
      `console=${result.consoleErrors.length} requests=${result.requestFailures.length}`);
  }
  process.exitCode = failures ? 1 : 0;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
