import ts from "typescript";
import { App } from "..";
import { getCanonicalFileName } from "./getCanonicalFileName";
import { getCurrentDirectory } from "./getCurrentDirectory";


export const formatDiagnosticsHost = {
  getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
  getCanonicalFileName,
};

export const reportDiagnostic = (diagnostic: ts.Diagnostic) => {
  ts.sys.write(
    ts.formatDiagnosticsWithColorAndContext(
      [diagnostic],
      formatDiagnosticsHost
    ) + ts.sys.newLine
  );
};
