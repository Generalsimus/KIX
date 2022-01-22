import { createProgramHost } from ".";

export function buildModules(this: createProgramHost, lastElementsBuildSize: number, criticalBuild: boolean = false) {

    const moduleRootName = [...this.moduleRootNamesSet].slice(lastElementsBuildSize * -1)
    // console.log("🚀 --> file: buildModules.ts --> line 7 --> buildModules --> moduleRootName.length", moduleRootName.length);
    if (moduleRootName.length || criticalBuild) {

        this.createProgram(moduleRootName, undefined)
        this.emit()
    }
}