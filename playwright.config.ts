import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./qa",
  projects: [
    { name: "phone", use: { viewport: { width: 390, height: 844 } } },
    { name: "compact", use: { viewport: { width: 360, height: 640 } } },
  ],
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:8081",
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    launchOptions: process.env.ATELIER_QA_BROWSER
      ? {
          executablePath: process.env.ATELIER_QA_BROWSER,
          args: [
            "--no-sandbox",
            "--disable-gpu",
            "--disable-software-rasterizer",
            "--no-zygote",
          ],
        }
      : undefined,
  },
  webServer: {
    command: "node scripts/serve-web.cjs",
    url: "http://127.0.0.1:8081",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
