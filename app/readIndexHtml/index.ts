import fs from "fs";
import path from "path";
import ts from "typescript";
import { App } from "../index";
import { createProgramHost } from "../createProgram";
import { readJsDomHtml } from "./readJsDomHtml";
import consola  from "consola";

export function readIndexHtml() {
  const indexHTMLPath = path.resolve("./index.html");

  if (!fs.existsSync(indexHTMLPath)) {
    throw consola.error(`Couldn't find ${indexHTMLPath} file.`);
  }
  
  const createHostProgram = () => {
    App.requestsThreshold.clear();
    const rootNames = readJsDomHtml(indexHTMLPath)
    const hostProgram = new createProgramHost(
      rootNames,
      {
        // module: ts.ModuleKind.AMD,
        module: ts.ModuleKind.None,
        incremental: true,
        allowJs: true,
        removeComments: true,
        jsx: ts.JsxEmit.Preserve,
        esModuleInterop: false,
        lib: [
          App.injectPaths.kixType
        ],

        // moduleResolution:ts.ModuleResolutionKind.NodeJs,
        /*
        @suppressOutputPathCheck: true,
        ეს საჭიროა იმის გამო რო უკვე არსებული ფაილიც დაბილდოს 
        მაგალითი:თუ ფაილი უკვე არსებობს ჩვეულებრივ შემთხვევაში მის დაბილდვაზე უარს იტყვის ts ი
        */
        suppressOutputPathCheck: true,
      },
      App.devMode,
      [
        App.injectPaths.kix,
        App.injectPaths.codeController
      ]
    )
    hostProgram.watcher.createWatcher({
      filePath: indexHTMLPath,
      callBack: () => {
        hostProgram.close();
        createHostProgram()
      }
    })
    return hostProgram
  }


  createHostProgram()

};
