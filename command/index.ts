import { App } from "../app";
import { parseArgs } from "./parseArgs";
import { runCommands } from "./runCommands";

export const readCommandsAndRun = async () => {
    parseArgs().then((argv) => {
        Object.assign(App, {
            port: argv.port as number,
            outDir: argv["outDir"],
            devMode: argv._.includes("start"),
            parsedArgs: argv,
        })
        runCommands()
    })
}