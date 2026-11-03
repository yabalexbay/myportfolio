import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  reporter: 'list',
  use: { baseURL: 'http://localhost:4174/' },
  webServer: {
    command: 'node scripts/serve.mjs',
    env: { PORT: '4174' },
    url: 'http://localhost:4174/',
    reuseExistingServer: false,
  },
});
