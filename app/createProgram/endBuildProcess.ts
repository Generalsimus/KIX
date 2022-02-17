import { createProgramHost } from ".";

export function endBuildProcess(this: createProgramHost) {
    if (!this.oldProgram) return;

    this.reportDiagnostics([
        ...this.configFileParsingDiagnostics,
        // ...this.oldProgram.getOptionsDiagnostics(),
        ...this.oldProgram.getGlobalDiagnostics(),
        ...this.oldProgram.getSyntacticDiagnostics(),
        ...this.oldProgram.getSemanticDiagnostics(),
        ...this.oldProgram.getDeclarationDiagnostics(),
        // ...this.oldProgram.getConfigFileParsingDiagnostics(),
    ]);
}