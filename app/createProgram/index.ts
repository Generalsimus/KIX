import path from "path";
import ts from "typescript";
import fs from "fs";
import { App } from "..";
import { reportDiagnostic } from "./reportDiagnostic";
import { createModuleNamesResolver } from "./createModuleNamesResolver";
import { readFile } from "./readFile";
import { getTsconfigFilePath } from "../../utils/getTsconfigFile";
import { createDefaultCompilerOptions } from "../../utils/createDefaultCompilerOptions";
import { createGetSourceFile, getSourceFile } from "./getSourceFile";
import { createCompiler } from "../compiler";

export const createProgram = (rootFilesPath: string[]) => {
  const configPath = getTsconfigFilePath();

  // createCompilerHostFromProgramHost
  const host = ts.createWatchCompilerHost(
    // undefined,
    configPath,
    createDefaultCompilerOptions(rootFilesPath),
    ts.sys,
    (
      rootNames: readonly string[] | undefined,
      options: ts.CompilerOptions | undefined,
      host?: ts.CompilerHost,
      oldProgram?: ts.SemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly ts.Diagnostic[],
      projectReferences?: readonly ts.ProjectReference[]
    ): ts.SemanticDiagnosticsBuilderProgram => {
      const program = ts.createSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);
      // program.
      if (host && host.getSourceFile !== getSourceFile) {
        // console.log(host && host.getSourceFile !== getSourceFile)
        host.getSourceFile = createGetSourceFile(host, options);
      }
      return program
      // return ts.createSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);

    },
    reportDiagnostic,
    () => { },
  );



  host.resolveModuleNames = createModuleNamesResolver(host);
  host.readFile = readFile;
  const watchProgram = ts.createWatchProgram(host)
  const program = watchProgram.getProgram()

  createCompiler(program, rootFilesPath)
  //

  return watchProgram;
};
