import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      // MICROCMS_API_KEY / MICROCMS_SERVICE_DOMAIN はモックせず、実際のmicroCMSサービスに接続する。
      // ローカルは`.env`、CIはGitHub Secretsから渡される想定(`next dev`が自動で.envを読むため、
      // ここでは上書きしない)
      // Basic認証を無効化してPlaywrightからの認証無しアクセスを通す
      BASIC_AUTH_USER: '',
      BASIC_AUTH_PASSWORD: '',
    },
  },
});