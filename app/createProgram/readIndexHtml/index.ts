import fs from "fs";
import path from "path";
import ts from "typescript";
import { readJsDomHtml } from "./readJsDomHtml";
import { App } from "../../index";
import { createProgramHost } from "..";
import chokidar from "chokidar"
import { fixRootNames } from "../fixRootNames";

export function readIndexHtml(this: createProgramHost) {
  const indexHTMLPath = path.resolve("./index.html");

  if (!fs.existsSync(indexHTMLPath)) {
    throw console.error(`Couldn't find ${indexHTMLPath} file.`);
  }


  const callBack = () => {
    App.resetRequestsThreshold();
    this.rootNames = fixRootNames(readJsDomHtml(indexHTMLPath));
  }

  this.watcher.createWatcher({
    filePath: indexHTMLPath,
    callBack: callBack
  })

  callBack()
};
