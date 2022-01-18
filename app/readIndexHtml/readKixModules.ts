
import { App } from "../";
import path from "path";
import { DOMWindow } from "jsdom";
import { formatDiagnosticsHost } from "../createProgram/reportDiagnostics";
import ts from "typescript"
import pathPosix from "path/posix";
import { fileNameToUrlPath } from "../../utils/fileNameToUrlPath";
// import { createModuleInfo } from "../../utils/createModuleInfo";
export const readKixModules = (window: DOMWindow): string[] => {
  App.moduleThree.clear();
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

      // App.moduleThree.set(filePathName, createModuleInfo(filePathName))
      
      programFiles.add(
        filePathName
      );
    });
  return [...programFiles];
};
