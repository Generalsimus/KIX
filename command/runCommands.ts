import consola from "consola";
import yargs from "yargs";
import { spawn } from "child_process";
import { createTemplate } from "../templates";
import { runDirectory } from "../app";
import { selfUpdateAndRunCommand } from "./selfUpdateAndRunCommand";

export const runCommands = async (argv: yargs.ArgumentsCamelCase<{}>) => {

    switch (argv._[0]) {
        case "new":
            const { isUpdated } = await selfUpdateAndRunCommand(argv, "kix");

            if (isUpdated) {
                const argvAppName = argv._[1]
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

