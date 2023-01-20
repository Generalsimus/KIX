import yargs from "yargs";
import { spawn } from "child_process";
import { createTemplate } from "../templates";
import { runDirectory } from "../app";
import { log } from "../utils/log";
import { yargsToWebpackEnv } from "./utils/yargsToWebpackEnv";
import { selfIfCanUpdate } from "./utils/selfIfCanUpdate";
export const runCommands = async (argv: yargs.ArgumentsCamelCase<{}>) => {

    switch (argv._[0]) {
        case "new":
            if (await selfIfCanUpdate(argv)) {
                const argvAppName = argv._[1];
                createTemplate(argvAppName ? String(argvAppName) : undefined);
            }
            break;
        default:
            spawn(`npm exec --call "${yargsToWebpackEnv("npm run", argv)}"`, {
                shell: true,
                cwd: runDirectory,
                stdio: "inherit",
            }).on("error", log.error);
    }


}
