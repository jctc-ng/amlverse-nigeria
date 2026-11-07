import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',
 timeout:30000,
 expect:{timeout:10000},
 retries:process.env.CI?1:0,
 reporter:process.env.CI?'github':'list',
 use:{baseURL:'http://127.0.0.1:4173/amlverse-nigeria/',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'desktop-chromium',use:{...devices['Desktop Chrome']}},{name:'mobile-chromium',use:{...devices['Pixel 7'],browserName:'chromium'}}],
 webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173/amlverse-nigeria/',reuseExistingServer:!process.env.CI,timeout:60000},
});