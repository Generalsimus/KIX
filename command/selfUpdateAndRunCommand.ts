import { spawn, exec } from "child_process";
import consola from "consola";
import yargs from "yargs";
import { runDirectory } from "../app";


const runKeywordForPackage = "APP_RUN_KEYW_OOOOO_ORD_FOR_PACKAGER"
export const selfUpdateAndRunCommand = async (argv: yargs.ArgumentsCamelCase<{}>, command: string) => {
    const isUpdated = true
    //  argv[runKeywordForPackage] !== runKeywordForPackage
    if (!isUpdated) {
        await new Promise((resolve) => {
            spawn("npm update -g kix", [], {
                shell: true,
                stdio: 'inherit'
            })
                .on("close", resolve);
        });
        spawn(command, [...process.argv.slice(2), `--${runKeywordForPackage}="${runKeywordForPackage}"`], {
            shell: true,
            cwd: runDirectory,
            stdio: 'inherit'
        })
    }

    return {
        isUpdated: isUpdated
    }
}