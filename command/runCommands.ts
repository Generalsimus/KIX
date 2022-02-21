import consola from "consola";
import { App } from "../app"
import { createAppTemplate } from "../app/template";
import { readIndexHtml } from "../app/readIndexHtml";
import { createProgramHost } from "../app/createProgram";
import ts from "typescript";
import { buildProd } from "../app/builder";

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
            readIndexHtml();
            break;
        case "build":
            readIndexHtml();
            buildProd();
            break;
    }


}

