import fs from "fs";
import path from "path";
import ts from "typescript";
import { App } from "../index";
import { createProgramHost } from "../createProgram";
import { readJsDomHtml } from "./readJsDomHtml";
import consola from "consola";

export function readIndexHtml() {
  const indexHTMLPath = path.resolve("./index.html");

  if (!fs.existsSync(indexHTMLPath)) {
    throw consola.error(`Couldn't find ${indexHTMLPath} file.`);
  }

  const createHostProgram = () => {
    App.requestsThreshold.clear();
    const rootNames = readJsDomHtml(indexHTMLPath)
    const defaultModuleRootNames = App.devMode ? [
      App.injectPaths.kix,
      App.injectPaths.codeController
    ] : [App.injectPaths.kix]
    const hostProgram = new createProgramHost(
      rootNames,
      {
        /* გაითვალისწინე რომ ამ ოფშნებს კლიენტი ვერ შეცვლის tsconfig.json ფაილიდან მაგრამ გააერთიანებს*/
        /* ამიტომ target ამოვაკელით :) */
        // target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None,
        // "moduleResolution": "node",
        incremental: true,
        allowJs: true,
        removeComments: true,
        jsx: ts.JsxEmit.Preserve,
        esModuleInterop: true,
        "moduleResolution": ts.ModuleResolutionKind.NodeNext,
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
      defaultModuleRootNames
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


  return createHostProgram();
};
