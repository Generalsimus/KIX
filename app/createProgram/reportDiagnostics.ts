import ts from "typescript";
import { App } from "..";
import { createProgramHost } from "./";


export function reportDiagnostics(this: createProgramHost, diagnostics: readonly ts.Diagnostic[]) {

  ts.sys.write(
    ts.formatDiagnosticsWithColorAndContext(
      diagnostics,
      this
    ) + ts.sys.newLine
  );

  ts.sys.write(`${this.reportDiagnoseTime} Found ${diagnostics.length} errors. Watching for file changes.`);

}; 