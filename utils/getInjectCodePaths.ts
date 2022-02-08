import path from "path";
import consola from "consola";
import fs from "fs"
import { normalizeSlashes } from "./normalizeSlashes";
import { resolveKixModule } from "./resolveKixModule";

export const getInjectCodePaths = (runDirName: string) => {
    const kixModulePath = resolveKixModule(runDirName);
    const mainFolderPath = path.dirname(kixModulePath);


    return {
        kix: checkPathIsSafe(kixModulePath),
        kixType: checkPathIsSafe(kixModulePath.slice(0, kixModulePath.lastIndexOf(".")) + ".d.ts")
    }
}
const checkPathIsSafe = (path: string) => {
    if (!fs.existsSync(path)) {
        throw consola.error(new Error(`Inject Path ${path} does not exist`));
    }
    return normalizeSlashes(path);
}