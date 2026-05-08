export default {
  testDir: '.',
  testMatch: ['playground/**/*.spec.js', 'tests/**/*.test.js'],
  use: {
    browserName: 'chromium',
    headless: true
  }
};
