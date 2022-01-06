import fs from "fs";
import path from "path";
import ts from "typescript";
import { readJsDomHtml } from "./readJsDomHtml";
import { App } from "../index";

export const readIndexHtml = () => {
  const indexHTMLPath = path.resolve("./index.html");

  if (!fs.existsSync(indexHTMLPath)) {
    throw console.error(`Couldn't find ${indexHTMLPath} file.`);
  }

  let program = readJsDomHtml(indexHTMLPath);

  if (App.devMode) {
    (ts.sys?.watchFile || fs.watch)(indexHTMLPath, () => {
      program.close();
      program = readJsDomHtml(indexHTMLPath);
    })
  }
};
