import ts from "typescript";
import { App } from "..";
import { createProgramHost } from "./";


export function reportDiagnostics(this: createProgramHost, diagnostics: readonly ts.Diagnostic[]) {
  for (const diagnostic of diagnostics) {
    const diagnose = { ...diagnostic, file: undefined };

    this.server.sendSocketMessage("ALERT_ERROR", {
      fileText: diagnostic.file?.getText(),
      ...diagnose
    })

  }
  ts.sys.write(
    ts.formatDiagnosticsWithColorAndContext(
      diagnostics,
      this
    ) + ts.sys.newLine
  );
  if (this.watch) {
    ts.sys.write(`${this.reportDiagnoseTime} Found ${diagnostics.length} errors. Watching for file changes.`)
  }
}; 