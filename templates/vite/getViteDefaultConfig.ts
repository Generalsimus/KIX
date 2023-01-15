export const getViteDefaultConfig = () => {
    return /* js */`
import { defineConfig } from "vite";
import { getTransformers } from "kix/transformers";
import { createPlugin, Extension, ScriptKind } from "vite-typescript-plugin";
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
    createPlugin({
      name: "kix",
      compilerOptions: {},
      test: /.(((t|j)sx?)|json|svg)$/i,
      transformers: getTransformers(),
      extensionsSupport: {
        ".svg": {
          extension: Extension.Js,
          scriptKind: ScriptKind.JS,
        }
      }
    }),
  ],
});
`.trim()
  }