import { createProgramHost } from ".";
import { getModuleInfo, ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const fixRootNames = (host: createProgramHost, rootNames: string[], moduleOptions: Partial<ModuleInfoType> = {}) => {
    rootNames = rootNames.map(normalizeSlashes)


    for (const filePath of rootNames) {
        const moduleInfo = getModuleInfo(filePath, moduleOptions);
        if (!moduleInfo.isNodeModule) {
            host.localFileWatcher.add(moduleInfo.modulePath)
        }

    }

    return rootNames;
}