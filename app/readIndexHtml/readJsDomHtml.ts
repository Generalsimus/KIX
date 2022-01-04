import { App } from "..";
import { JSDOM } from "jsdom";
import fs from "fs";
import { readKixModules } from "./readKixModules";
import { creaePrgram } from "./createProgram";

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

  const indexHtmlPageString =
    "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
  for (const indexHTMLUrlPath of App.indexHTMLUrlPaths) {
    App.requestsThreshold.set(indexHTMLUrlPath, indexHtmlPageString);
  }

  const kixModules = readKixModules(window);

  return creaePrgram(kixModules);
};
