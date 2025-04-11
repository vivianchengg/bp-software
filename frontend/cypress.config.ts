import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
  },
  env: {
    TEST_EMAIL: 'test@hfs1uolhlixy.mailisk.net'
  },
});
