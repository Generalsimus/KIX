import path from "path";
import ts from "typescript";
import { App } from "../..";
import { reportDiagnostic } from "../../../utils/reportDiagnostic";
import { createModuleNamesResolver } from "../../../utils/createModuleNamesResolver";

export const creaePrgram = (rootNames: string[]) => {
  const configPath = ts.findConfigFile(
    /*searchPath*/ App.runDirName,
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  const host = ts.createWatchCompilerHost(
    configPath,
    {
      rootNames: rootNames,
      noEmit: true,
      allowJs: true,
      checkJs: false,
    },
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    () => {}
  );
  host.resolveModuleNames = createModuleNamesResolver(host);
  host.getSourceFile = (fileName, languageVersion) => {};

  return ts.createWatchProgram(host);
};
