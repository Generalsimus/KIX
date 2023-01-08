export const getViteDefaultConfig = () => {
    return /* js */`
import { defineConfig } from "vite";
import { getTransformers } from "kix/transformers";
import { createPlugin } from "vite-typescript-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createPlugin({
      name: "kix",
      options: {},
      test: /\.(((t|j)sx?)|json)$/i,
      transformers: getTransformers(),
    }),
  ],
});`.trim()
  }