import { createProgramHost } from ".";

export function diagnose(this: createProgramHost) {
    if (!this.oldProgram) return;
    
    this.currentDiagnostics = [
        ...this.configFileParsingDiagnostics,
        // ...this.oldProgram.getOptionsDiagnostics(),
        ...this.oldProgram.getGlobalDiagnostics(),
        ...this.oldProgram.getSyntacticDiagnostics(),
        ...this.oldProgram.getSemanticDiagnostics(),
        ...this.oldProgram.getDeclarationDiagnostics(),
        // ...this.oldProgram.getConfigFileParsingDiagnostics(),
    ]
}