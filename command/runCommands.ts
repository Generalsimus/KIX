import consola from "consola";
import { App } from "../app"
import { createAppTemplate } from "../createAppTemplate";
import { readIndexHtml } from "../app/readIndexHtml";
import { createServer } from "../server";

export const runCommands = () => {
    if (!App.parsedArgs) {
        throw new Error("yargs parsing Error")
    }
    switch (App.parsedArgs._[0]) {
        case "new":
            createAppTemplate().catch(consola.error);
            break;
        case "start":
            createServer()
        case "build":
            readIndexHtml();
            break;
    }


}

