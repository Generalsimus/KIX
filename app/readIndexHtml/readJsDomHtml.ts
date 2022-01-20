import { App } from "..";
import { JSDOM } from "jsdom";
import fs from "fs";
import { readKixModules } from "./readKixModules";
import { createProgramHost } from "../createProgram";
import ts from "typescript";

export const readJsDomHtml = (indexHTMLPath: string) => {
  App.requestsThreshold.clear();
  const htmlDom = new JSDOM(fs.readFileSync(indexHTMLPath, "utf8")),
    window = htmlDom.window,
    document = window.document;

  document.body[
    document.body.firstElementChild ? "insertBefore" : "appendChild"
  ](
    Object.assign(document.createElement("script"), {
      src: App.nodeModulesUrlPath,
    }),
    document.body.firstElementChild
  );

  const kixModules = readKixModules(window);

  const indexHtmlPageString =
    "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
  for (const indexHTMLUrlPath of App.indexHTMLUrlPaths) {
    App.requestsThreshold.set(indexHTMLUrlPath, (_, res) => res.end(indexHtmlPageString));
  }
  // module: ModuleKind.AMD,
  // checkJs: false,
  // allowJs: true,
  // allowSyntheticDefaultImports: true,
  // resolveJsonModule: true,
  // moduleResolution: ModuleResolutionKind.NodeJs,
  // suppressOutputPathCheck: true,
  // forceConsistentCasingInFileNames: true,
  // watch: true,
  // jsx: "preserve",
  // __Node_Module_Window_Name: getModuleWindowName(),
  // "noImplicitAny": true,
  return new createProgramHost(kixModules, {
    module: ts.ModuleKind.CommonJS,
    // emitDeclarationOnly: false,
  }, true);
};
