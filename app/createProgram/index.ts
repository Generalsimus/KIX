import path from "path";
import ts from "typescript";
import fs from "fs";
import { App } from "..";
import { reportDiagnostic } from "./reportDiagnostic";
import { createModuleNamesResolver } from "./createModuleNamesResolver";
import { readFile } from "./readFile";
import { getTsconfigFilePath } from "../../utils/getTsconfigFile";
import { createDefaultCompilerOptions } from "../../utils/createDefaultCompilerOptions";

export const createProgram = (rootNames: string[]) => {
  const configPath = getTsconfigFilePath();


  const host = ts.createWatchCompilerHost(
    // undefined,
    configPath,
    createDefaultCompilerOptions(rootNames),
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    // createCustomSemanticDiagnosticsBuilderProgram as typeof ts.createSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    () => { }
  );
  host.resolveModuleNames = createModuleNamesResolver(host);

  host.readFile = readFile;


  return ts.createWatchProgram(host);
};
