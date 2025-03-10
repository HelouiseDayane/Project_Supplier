import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results.stats.failures > 0) {
          console.log(`A especificação ${spec.name} falhou`);
        }
      });
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    supportFile: "cypress/support/component.js", 
  },
});
