import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  content: ["node_modules/flowbite-react/lib/esm/**/*.js"],
  // eslint-disable-next-line no-undef
  plugins: [react(), eslint(), require("flowbite/plugin")],
});
