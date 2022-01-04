import ts from "typescript";
import { App } from "../app";

const fileNameLowerCaseRegExp = /[^\u0130\u0131\u00DFa-z0-9\\/:\-_\. ]+/g,
  toLowerCase = (fileName: string) => fileName.toLowerCase(),
  system = ts.sys,
  createGetCanonicalFileName = () => {
    return ts.sys.useCaseSensitiveFileNames
      ? (fileName: string): string => fileName
      : (fileName: string): string => {
          return fileNameLowerCaseRegExp.test(fileName)
            ? fileName.replace(fileNameLowerCaseRegExp, toLowerCase)
            : fileName;
        };
  };
export const formatDiagnosticsHost = {
  getCurrentDirectory: () => App.runDirName,
  getNewLine: () => ts.sys.newLine,
  getCanonicalFileName: createGetCanonicalFileName(),
};

export const reportDiagnostic = (diagnostic: ts.Diagnostic) => {
  ts.sys.write(
    ts.formatDiagnosticsWithColorAndContext(
      [diagnostic],
      formatDiagnosticsHost
    ) + ts.sys.newLine
  );
};
