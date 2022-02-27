import { createProgramHost } from ".";
import { fixRootNames } from "./fixRootNames";

export function buildModules(this: createProgramHost, lastElementsBuildSize: number) {
    if (!lastElementsBuildSize) return;
    const moduleRootName = [...this.moduleRootNamesSet].slice(lastElementsBuildSize * -1)

    // const modulesCount = this.moduleRootNamesSet.size

    // this.startBuildProcess();
    // this.createProgram()
    // this.emitFileLobby.add(path)
    // this.emitLobbyFiles()
    // this.buildModules(this.moduleRootNamesSet.size - modulesCount)
    // console.log("🚀 --> file: --> resolvedModule", this.moduleRootNamesSet);
    if (moduleRootName.length) {
        // console.log("🚀 --> file: buildModules.ts --> line 7 --> buildModules --> moduleRootName", moduleRootName);
        // console.log("🚀 --> file: buildModules.ts --> line 5 --> buildModules --> lastElementsBuildSize", lastElementsBuildSize);
        // console.log("EMITMODULEEEEEEEEEEEESSSSSSSSSSS")
        const modulesCount = this.moduleRootNamesSet.size
        this.createProgram(fixRootNames(this, moduleRootName, { isNodeModule: true }));
        this.emit();
        this.buildModules(this.moduleRootNamesSet.size - modulesCount)
    }
}