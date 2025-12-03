// This Vite config file (vite.config.js) tells Rollup (production bundler)
// to treat multiple HTML files as entry points so each becomes its own built page.

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/sign-in.html"),
        main: resolve(__dirname, "src/pages/main.html"),
        profile: resolve(__dirname, "src/pages/profile.html"),
        favorites: resolve(__dirname, "src/pages/favorites.html"),
        restaurantInfo: resolve(__dirname, "src/pages/restaurant-info.html"),
        addRecord: resolve(__dirname, "src/pages/add-record.html"),
        addRestaurant: resolve(__dirname, "src/pages/add-restaurant.html"),
      },
    },
  },
});
