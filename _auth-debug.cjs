const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  const logs = [];
  page.on("console", (m) => logs.push(`[console.${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  page.on("requestfailed", (r) =>
    logs.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`)
  );
  page.on("response", (r) => {
    if (r.url().includes("/api/auth")) logs.push(`[api] ${r.status()} ${r.url()}`);
  });

  await page.goto("http://localhost:3000/signup", { waitUntil: "networkidle" });
  await page.fill("input[name=name]", "Browser Test User");
  await page.fill("input[name=email]", `brwsr${Date.now()}@test.local`);
  await page.fill("input[name=password]", "testpass123");
  await page.fill("input[name=confirmPassword]", "testpass123");
  await page.click("button[type=submit]");
  await page.waitForTimeout(4000);

  logs.push(`[final-url] ${page.url()}`);
  console.log(logs.join("\n"));
  await browser.close();
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});