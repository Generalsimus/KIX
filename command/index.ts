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
        const creatingNewApp = argv._.includes("new")
        // console.log({
        //     realModuleDirName: App.realModuleDirName,
        //     runDirName: App.runDirName,
        //     isChildPath: !isChildPath(App.realModuleDirName, App.runDirName)
        // })

        if (!isChildPath(App.realModuleDirName, App.runDirName) && !creatingNewApp) {
            spawn('npm', ["exec", "kix", ...process.argv.slice(2)], {
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