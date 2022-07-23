import { App } from "../app";
import { parseArgs } from "./parseArgs";
import { runCommands } from "./runCommands";
import { spawn } from "child_process"
import { isChildPath } from "../utils/isChildPath";
import { chdir } from "process";

export const readCommandsAndRun = async () => {
    parseArgs().then((argv) => {

        Object.assign(App, {
            port: argv.port as number,
            outDir: argv["outDir"],
            devMode: argv._.includes("start"),
            parsedArgs: argv,
        })


        if (!isChildPath(App.realModuleDirName, App.runDirName)) {
            
            spawn('npm', ["exec", "kix@latest", ...process.argv.slice(2)], {
                shell: true,
                stdio: 'inherit'
            }).on("error", () => {
                runCommands()
            });

        } else {
            runCommands()
        }
    })
}