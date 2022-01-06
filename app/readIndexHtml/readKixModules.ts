
import { App } from "../";
import path from "path";
import { DOMWindow } from "jsdom";
import { formatDiagnosticsHost } from "../createProgram/reportDiagnostic";
import ts from "typescript"
export const readKixModules = (window: DOMWindow): string[] => {
  const document = window.document,
    programFiles = new Set<string>();
  document
    .querySelectorAll('script')
    .forEach((scriptElement) => {
      if (scriptElement.getAttribute("lang")?.trim() !== "kix") return

      scriptElement.removeAttribute("lang");

      const urlInfo = new window.URL(scriptElement.src, "http://e");
      console.log((ts as any)["normalizeSlashes"](path.join(App.runDirName, decodeURIComponent(urlInfo.pathname))), path.normalize(path.join(App.runDirName, decodeURIComponent(urlInfo.pathname))))
      programFiles.add(
        // ts["normalizeSlashes"](
        path.join(App.runDirName, decodeURIComponent(urlInfo.pathname))
        // )
      );
    });
  App.moduleThree.clear();
  return [...programFiles];
};
