import { getExecResToString } from "./getExecResToString";
import { normalizeVersion } from "./normalizeVersion";
import currentPackage from "../../package.json";

export const getInstallableVersions = async () => {
    const getTsVersionCommand = `npm view kix dependencies typescript -v`
    const getKixLastVersionCommand = `npm view kix version`

    let kixLastVersionString = await getExecResToString(getKixLastVersionCommand);
    let tsVersionString = await getExecResToString(getTsVersionCommand);

    if (!kixLastVersionString || !tsVersionString) {
        kixLastVersionString = currentPackage.version
        tsVersionString = currentPackage.dependencies.typescript
    }


    kixLastVersionString = normalizeVersion(kixLastVersionString);
    tsVersionString = normalizeVersion(tsVersionString);

    return {
        kixInstallVersion: kixLastVersionString,
        typescriptInstallVersion: tsVersionString
    }
}