import consola from "consola";
import { App } from "../app"
import { createAppTemplate } from "../app/template";
import { readIndexHtml } from "../app/createProgram/readIndexHtml";
import { createProgramHost } from "../app/createProgram";
import ts from "typescript";

export const runCommands = () => {
    if (!App.parsedArgs) {
        throw new Error("yargs parsing Error")
    }
    switch (App.parsedArgs._[0]) {
        case "new":
            createAppTemplate().catch(consola.error);
            break;
        case "start":
            App.devMode = true;
        case "build":
            // readIndexHtml();
            new createProgramHost(
                {
                    module: ts.ModuleKind.CommonJS,
                    incremental: true,
                    /*
                    @suppressOutputPathCheck: true,
                    ეს საჭიროა იმის გამო რო უკვე არსებული ფაილიც დაბილდოს 
                    მაგალითი:თუ ფაილი უკვე არსებობს ჩვეულებრივ შემთხვევაში მის დაბილდვაზე უარს იტყვის ts ი
                    */
                    suppressOutputPathCheck: true,
                },
                App.devMode,
                [
                    App.kixModulePath
                ]
            )
            break;
    }


}

