import yargs from "yargs"
import { log } from "../../utils/log"
import { startLoader } from "../../utils/startLoader"
import pacote from "pacote"
import { spawn } from "child_process";
import { runDirectory } from "../../app";
import packageJson from "../../package.json";

const runKeywordForPackage = "APP_RUN_KEY_OOOOO_ORD_FOR_PACKAGER";
export const selfIfCanUpdate = async (argv: yargs.ArgumentsCamelCase<{}>) => {
    const packageSelfName = packageJson.name;
    const stopLoader = startLoader("Please wait...");
    const manifest = await pacote.manifest(packageSelfName).finally(stopLoader).catch(log.warn);
    const isUpdated = packageJson?.version === manifest?.version || argv[runKeywordForPackage] === runKeywordForPackage;

    if (!isUpdated) {
        await new Promise((resolve) => {
            spawn(`npm update -g ${packageSelfName}`, [], {
                shell: true,
                stdio: 'inherit'
            })
                .on("error", log.error)
                .on("close", resolve);
        });

        spawn(packageSelfName, [...process.argv.slice(2), `--${runKeywordForPackage}="${runKeywordForPackage}"`], {
            shell: true,
            cwd: runDirectory,
            stdio: 'inherit'
        })
    }

    return isUpdated
}