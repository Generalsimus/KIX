
import { App } from "../";
import path from "path";
import { DOMWindow } from "jsdom";
import { formatDiagnosticsHost } from "../createProgram/reportDiagnostic";
import ts from "typescript"
import pathPosix from "path/posix";
export const readKixModules = (window: DOMWindow): string[] => {
  const document = window.document,
    programFiles = new Set<string>();
  document
    .querySelectorAll('script')
    .forEach((scriptElement) => {
      if (scriptElement.getAttribute("lang")?.trim() !== "kix") return

      scriptElement.removeAttribute("lang");

      const urlInfo = new window.URL(scriptElement.src, "http://e");
      
      
      programFiles.add(
        pathPosix.join(App.runDirName, decodeURIComponent(urlInfo.pathname)).split(path.sep).join("/")
      );
    });
  App.moduleThree.clear();
  return [...programFiles];
};
