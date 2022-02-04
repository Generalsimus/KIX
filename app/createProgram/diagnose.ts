import { createProgramHost } from ".";

export function diagnose(this: createProgramHost) {
    if (!this.oldProgram) return;
    this.reportDiagnostics([
        ...this.configFileParsingDiagnostics,
        ...this.oldProgram.getSemanticDiagnostics(),
        ...this.oldProgram.getSyntacticDiagnostics(),
        ...this.oldProgram.getDeclarationDiagnostics(),
        ...this.oldProgram.getGlobalDiagnostics(),
    ]);
}