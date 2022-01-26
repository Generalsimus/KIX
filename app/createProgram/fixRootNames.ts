import { getModuleInfo, ModuleInfoType } from "../../utils/getModuleInfo";
import { normalizeSlashes } from "../../utils/normalizeSlashes";

export const fixRootNames = (rootNames: string[], moduleOptions: Partial<ModuleInfoType> = {}) => {
    rootNames = rootNames.map(normalizeSlashes)


    for (const filePath of rootNames) {
        getModuleInfo(filePath, moduleOptions);
    }

    return rootNames;
}