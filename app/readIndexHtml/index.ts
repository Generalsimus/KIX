import fs from "fs";
import path from "path";
import ts from "typescript";
// import chokidar from "chokidar";
import { readJsDomHtml } from "./readJsDomHtml";
import { App } from "../index";

export const readIndexHtml = () => {
  //   const indexHTMLRequesPaths = App.indexHTMLRequesPaths;
  const indexHTMLPath = path.resolve("./index.html");

  if (!fs.existsSync(indexHTMLPath)) {
    throw console.error(`Couldn't find ${indexHTMLPath} file.`);
  }

  let program = readJsDomHtml(indexHTMLPath);

  if (App.devMode) {
    ts.sys.watchFile(indexHTMLPath, () => {
      program.close();
      program = readJsDomHtml(indexHTMLPath);
    });
  }
};
