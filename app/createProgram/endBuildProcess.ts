import { createProgramHost } from ".";

export function endBuildProcess(this: createProgramHost) {
    if (!this.oldProgram) return;

    this.reportDiagnostics(this.currentDiagnostics);
}