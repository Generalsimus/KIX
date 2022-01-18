import ts from "typescript";
import { App } from "..";
import { getCanonicalFileName } from "./getCanonicalFileName";
import { getCurrentDirectory } from "./getCurrentDirectory";


export const formatDiagnosticsHost = {
  getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
  getCanonicalFileName,
};

export const reportDiagnostics = (diagnostics: readonly ts.Diagnostic[]) => {
   
  ts.sys.write("\x1Bc"+
    ts.formatDiagnosticsWithColorAndContext(
      diagnostics,
      formatDiagnosticsHost
    ) + ts.sys.newLine
  );
};
