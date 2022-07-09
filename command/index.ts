import { App } from "../app";
import { parseArgs } from "./parseArgs";
import { runCommands } from "./runCommands";
import { spawn } from "child_process"
import { isChildPath } from "../utils/isChildPath";

export const readCommandsAndRun = async () => {
    parseArgs().then((argv) => {
        Object.assign(App, {
            port: argv.port as number,
            outDir: argv["outDir"],
            devMode: argv._.includes("start"),
            parsedArgs: argv,
        })


        if (!isChildPath(App.realModuleDirName, App.runDirName)) {
            spawn('npm', ["run", "dev"], {
                shell: true,
                stdio: 'inherit'
            }).on("close", () => {
                runCommands()
            });

        } else {
            runCommands()
        }
    })
}