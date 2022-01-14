
import { App } from "../";
import path from "path";
import { DOMWindow } from "jsdom";
import { formatDiagnosticsHost } from "../createProgram/reportDiagnostic";
import ts from "typescript"
import pathPosix from "path/posix";
import { fileNameToUrlPath } from "../../utils/fileNameToUrlPath";
export const readKixModules = (window: DOMWindow): string[] => {
  const document = window.document,
    programFiles = new Set<string>();
  document
    .querySelectorAll('script')
    .forEach((scriptElement) => {
      if (scriptElement.getAttribute("lang")?.trim() !== "kix") return

      scriptElement.removeAttribute("lang");
      // fileNameToUrlPath



      const urlInfo = new window.URL(scriptElement.src, "http://e");
      const filePathName = pathPosix.join(App.runDirName, decodeURIComponent(urlInfo.pathname)).split(path.sep).join("/")

      scriptElement.setAttribute("src", fileNameToUrlPath(filePathName))

      programFiles.add(
        filePathName
      );
    });
  App.moduleThree.clear();
  return [...programFiles];
};
