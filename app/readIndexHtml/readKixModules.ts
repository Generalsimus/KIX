
import path from "path";
import { DOMWindow } from "jsdom";
import ts from "typescript"
import pathPosix from "path/posix";
import { fileNameToUrlPath } from "../../utils/fileNameToUrlPath";
import { getOutputFileName } from "../../utils/getOutputFileName";
import { normalizeSlashes } from "../../utils/normalizeSlashes";
import { App } from "..";
// import { createModuleInfo } from "../../utils/createModuleInfo";
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
      const filePathName = pathPosix.join(App.runDirName, decodeURIComponent(urlInfo.pathname))

      scriptElement.setAttribute("src", fileNameToUrlPath(getOutputFileName(filePathName)))

      

      programFiles.add(filePathName);
    });
  return [...programFiles];
};
