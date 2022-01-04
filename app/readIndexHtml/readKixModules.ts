import ts from "typescript";
import { App } from "../";
import path from "path";
import { resetModuleThree } from "./resetModuleThree";
import { DOMWindow } from "jsdom";
import { formatDiagnosticsHost } from "../../utils/reportDiagnostic";

export const readKixModules = (window: DOMWindow): string[] => {
  const document = window.document,
    programFiles = new Set<string>();
  document
    .querySelectorAll('script[lang="kix"]')
    .forEach((scriptElement: HTMLScriptElement) => {
      scriptElement.removeAttribute("lang");

      const urlInfo = new window.URL(scriptElement.src, "http://e");

      programFiles.add(
        ts["normalizeSlashes"](
          path.join(App.runDirName, decodeURIComponent(urlInfo.pathname))
        )
      );
    });

  resetModuleThree(programFiles);
  return [...programFiles];
};
