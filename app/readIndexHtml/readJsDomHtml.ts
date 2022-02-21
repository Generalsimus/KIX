
import { JSDOM } from "jsdom";
import fs from "fs";
import { readKixModules } from "./readKixModules";
import ts from "typescript";
import { normalizeSlashes } from "../../utils/normalizeSlashes";
import { App } from "..";

export const readJsDomHtml = (indexHTMLPath: string) => {

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
    App.requestsThreshold.set(indexHTMLUrlPath, () => indexHtmlPageString);
  }

  return kixModules
};
