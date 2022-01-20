import { createProgramHost } from ".";
import { App } from "..";
import { getModuleInfo } from "../../utils/getModuleInfo";
import { getOutputFileName } from "../../utils/getOutputFileName";
import { rootWriter } from "../rootWriter";

export const useRootFileWriter = (host: createProgramHost) => {
    for (const rootFile of host.rootNames) {
        const moduleInfo = getModuleInfo(rootFile);
        const outFileName = getOutputFileName(rootFile)
        moduleInfo.rootWriters[rootFile] = new rootWriter(outFileName)
    }
}