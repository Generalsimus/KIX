import { App } from "../app";
import { parseArgs } from "./parseArgs";
import { runCommands } from "./runCommands";
import { spawn, exec } from "child_process"
import { isChildPath } from "../utils/isChildPath";
import { chdir } from "process";
const runKeywordForPackage = "APP_RUN_KEYWORD_FOR_PACKAGER"
export const readCommandsAndRun = async () => {
    parseArgs().then((argv) => {
        Object.assign(App, {
            port: argv.port as number,
            outDir: argv["outDir"],
            devMode: argv._.includes("start"),
            parsedArgs: argv,
        })
        const creatingNewApp = argv._.includes("new")


        // console.log("🚀 --> file: index.ts --> line 20 --> parseArgs --> canRunPackageCommand", {
        //     realModuleDirName: App.realModuleDirName,
        //     runDirName: App.runDirName,
        // });
        if (!isChildPath(App.realModuleDirName, App.runDirName) && !creatingNewApp && argv[runKeywordForPackage] !== runKeywordForPackage) {
            // npm exec kix start --www="sss"
            spawn("npm exec -- kix", [...process.argv.slice(2), `--${runKeywordForPackage}="${runKeywordForPackage}"`], {
                shell: true,
                stdio: 'inherit'
            }).on("error", () => {
                // console.log("🚀 --> file: index.ts --> line 28 --> spawn --> runCommands", runCommands);
                runCommands()
            });

        } else {
            runCommands()
        }
    })
}