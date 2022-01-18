import path from "path";
import ts, { getDefaultLibFileName, transform } from "typescript";
import fs from "fs";
import { App } from "..";
import { reportDiagnostics } from "./reportDiagnostics";
// import { createModuleNamesResolver } from "./createModuleNamesResolver";
import { readFile } from "./readFile";
import { getTsconfigFilePath } from "../../utils/getTsconfigFile";
import { createDefaultCompilerOptions } from "../../utils/createDefaultCompilerOptions";
import { getSourceFile } from "./getSourceFile";
import chokidar, { FSWatcher } from "chokidar";
import { getCurrentDirectory } from "./getCurrentDirectory";
import { getCanonicalFileName } from "./getCanonicalFileName";
import { resolveModuleNames } from "./resolveModuleNames";
import { getTransformer } from "../../transform";
import { parseJsonFile } from "../../utils/parseJson";
import { createConfigFileParser } from "./createConfigFileParser";
import { diagnose } from "./diagnose";
import { watchFiles } from "./watchFiles";
import { Server } from "../../server";
// const sss = ts.createCompilerHost({}, true)

// console.log("getDefaultLibLocation", ts.getDefaultLibFileName()); 


// ts.getParsedCommandLineOfConfigFile
// const configPath = getTsconfigFilePath();
// export const parseJsonFile = (fileName) => {
//   return fs.existsSync(fileName) ? parseConfigFileTextToJson(fileName, readFileSync(fileName, "utf8")).config : {}
// }
// ParsedCommandLine

export class createProgramHost {
  rootNames: string[];
  options: ts.CompilerOptions;
  oldProgram: ts.Program | undefined;
  defaultLibFileName: string;
  defaultLibLocation: string;
  configFileParsingDiagnostics = new Set<ts.Diagnostic>()
  configFileParser: ReturnType<typeof createConfigFileParser>
  constructor(rootNames: string[] = [], options: ts.CompilerOptions = {}) {
    this.rootNames = rootNames;
    this.options = options;
    this.defaultLibLocation = path.dirname(ts.sys.getExecutingFilePath());
    this.defaultLibFileName = path.join(this.defaultLibLocation, ts.getDefaultLibFileName(this.options));
    this.configFileParser = createConfigFileParser(this)
    this.emit();
    this.diagnose()
    this.watchFiles()
  }
  watcher = new FSWatcher({ ignoreInitial: true });
  configWatcher = new FSWatcher({ ignoreInitial: true });
  server = new Server(this)
  transformer = getTransformer()
  getSourceFile = getSourceFile
  readFile = readFile
  getCurrentDirectory = getCurrentDirectory
  getDefaultLibLocation = () => this.defaultLibLocation
  getDefaultLibFileName = () => this.defaultLibFileName
  fileExists = fs.existsSync
  getNewLine = () => ts.sys.newLine
  getCanonicalFileName = getCanonicalFileName
  useCaseSensitiveFileNames = () => ts.sys.useCaseSensitiveFileNames
  resolveModuleNames = resolveModuleNames
  diagnose = diagnose
  reportDiagnostics = reportDiagnostics
  watchFiles = watchFiles
  writeFile = (filename: string, content: string) => {
    console.log('writeFile', filename)
  }
  emit(sourceFile?: ts.SourceFile) {
    return this.createProgram().emit(
      sourceFile,
      undefined,
      undefined,
      undefined,
      this.transformer,
    );
  }
  createProgram() {
    return this.oldProgram = ts.createProgram({
      rootNames: this.rootNames,
      options: this.options,
      oldProgram: this.oldProgram,
      host: this,
    })
  }
  close() {
    this.watcher.close()
    this.configWatcher.close()
  }
}

// export const createProgram = (rootFilesPath: string[]) => {
//   const configPath = getTsconfigFilePath();

  // createCompilerHostFromProgramHost
//   const host = ts.createWatchCompilerHost(
//     // undefined,
//     configPath,
//     createDefaultCompilerOptions(rootFilesPath),
//     ts.sys,
//     (
//       rootNames: readonly string[] | undefined,
//       options: ts.CompilerOptions | undefined,
//       host?: ts.CompilerHost,
//       oldProgram?: ts.SemanticDiagnosticsBuilderProgram,
//       configFileParsingDiagnostics?: readonly ts.Diagnostic[],
//       projectReferences?: readonly ts.ProjectReference[]
//     ): ts.SemanticDiagnosticsBuilderProgram => {
//       const program = ts.createSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);
//       // program.
//       // program.get
//       // if (host && host.getSourceFile !== getSourceFile) {
//       //   // host.getCustomTransformers = (): any => { }
//       //   // host.getCustomTransformers
//       //   // console.log(host && host.getSourceFile !== getSourceFile)
//       //   // host.emit
//       //   // program.
//       //   // program.emit = (...w): any => {
//       //   //   console.log(w)
//       //   // };
//       //   host.getSourceFile = createGetSourceFile(host, options);
//       // }
//       return program
//       // return ts.createSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);

//     },
//     reportDiagnostic,
//     () => { },
//   );

//   // ts.getParsedCommandLineOfConfigFile(configFileName, optionsToExtendForConfigFile, parseConfigFileHost, extendedConfigCache || (extendedConfigCache = new ts.Map()), watchOptionsToExtend, extraFileExtensions)
//   // host.resolveModuleNames = createModuleNamesResolver(host);
//   // host.readFile = readFile;

//   const watchProgram = ts.createWatchProgram(host)
//   // const program = watchProgram.getProgram()
//   // createCompiler(program, rootFilesPath)


//   return watchProgram;
// };
