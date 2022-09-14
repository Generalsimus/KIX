import consola from "consola";
// import { App } from "../app"
// import { createAppTemplate } from "../app/template";
// import { readIndexHtml } from "../app/readIndexHtml";
import yargs from "yargs";
import { spawn, exec } from "child_process";
// import { isChildPath } from "../utils/isChildPath";
import { chdir } from "process";
// import consola from "consola";
import { createTemplate } from "../templates";
import { runDirectory } from "../app";

export const runCommands = (argv: yargs.ArgumentsCamelCase<{}>) => {

    // console.log("🚀 --> file: runCommands.ts --> line 25 --> spawn --> process", process.argv);
    switch (argv._[0]) {
        case "new":
            createTemplate()
            break;
        default:
            spawn("npm exec -- npm run ", [...process.argv.slice(2)], {
                shell: true,
                cwd: runDirectory,
                stdio: "inherit",
            }).on("error", consola.error);
        // case "start":
        // App.devMode = true;
        // readIndexHtml();
        // break;
        // case "build":
        // readIndexHtml().buildProduct();
        // break;
    }


}

