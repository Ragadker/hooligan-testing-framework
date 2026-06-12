export default {
  testDir: '.',
  testMatch: [
    'playground/**/*.spec.js',
    'tests/**/*.test.js',
    'examples/**/*.spec.js'
  ],
  use: {
    browserName: 'chromium',
    headless: true
  }
};
