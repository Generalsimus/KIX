import { createProgramHost } from ".";

export function buildModules(this: createProgramHost, lastElementsBuildSize: number) {

    const moduleRootName = [...this.moduleRootNamesSet].slice(lastElementsBuildSize * -1)
    // console.log("🚀 --> file: buildModules.ts --> line 7 --> buildModules --> moduleRootName.length", moduleRootName.length)
        console.log("🚀 --> file: buildModules.ts --> line 8 --> buildModules --> moduleRootName", moduleRootName);
    if (moduleRootName.length) {
        console.log(" dModules --> moduleRootName", moduleRootName);

        this.createProgram(moduleRootName, undefined)
        this.emit()
    }
}