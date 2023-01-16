export const getViteDefaultConfig = () => {
  return /* js */`
import { defineConfig } from "vite";
import { getTransformers } from "kix/transformers";
import { createTsPlugin, ts } from "vite-typescript-plugin";
import { createSvgPlugin } from "svg-plugin-vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createSvgPlugin({
      name: "kix-svg",
      config: {
        jsxRuntime: "automatic",
      }
    }),
    createTsPlugin({
      name: "kix",
      compilerOptions: {},
      test: /.(((t|j)sx?)|json|svg)$/i,
      transformers: getTransformers(),
      extensionsSupport: {
        ".svg": {
          extension: ts.Extension.Js,
          scriptKind: ts.ScriptKind.JS,
        }
      }
    }),
  ],
});
`.trim()
}