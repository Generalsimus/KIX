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
import { selfUpdateAndRunCommand } from "./selfUpdateAndRunCommand";

export const runCommands = async (argv: yargs.ArgumentsCamelCase<{}>) => {

    switch (argv._[0]) {
        case "new":
            const { isUpdated } = await selfUpdateAndRunCommand(argv, "kix new");
            // console.log("🚀 --> file: runCommands.ts --> line 19 --> runCommands --> isUpdated", isUpdated);

            if (isUpdated) {
                const argvAppName = argv._[2]
                createTemplate(argvAppName ? String(argvAppName) : undefined);
            }
            break;
        default:
            spawn("npm exec -- npm run ", [...process.argv.slice(2)], {
                shell: true,
                cwd: runDirectory,
                stdio: "inherit",
            }).on("error", consola.error);
    }


}

