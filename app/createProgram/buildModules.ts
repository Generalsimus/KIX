import { createProgramHost } from ".";
import { fixRootNames } from "./fixRootNames";

export function buildModules(this: createProgramHost, lastElementsBuildSize: number) {
    if (!lastElementsBuildSize) return;
    const moduleRootName = [...this.moduleRootNamesSet].slice(lastElementsBuildSize * -1)


    if (moduleRootName.length) {
        console.log("🚀 --> file: buildModules.ts --> line 5 --> buildModules --> lastElementsBuildSize", lastElementsBuildSize);
        // console.log("EMITMODULEEEEEEEEEEEESSSSSSSSSSS")
        this.createProgram(fixRootNames(this, moduleRootName, { isNodeModule: true }))
        this.emit()
    }
}