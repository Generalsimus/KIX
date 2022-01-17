import path from "path";
import ts, { getDefaultLibFileName, transform } from "typescript";
import fs from "fs";
import { App } from "..";
import { reportDiagnostic } from "./reportDiagnostic";
import { createModuleNamesResolver } from "./createModuleNamesResolver";
import { readFile } from "./readFile";
import { getTsconfigFilePath } from "../../utils/getTsconfigFile";
import { createDefaultCompilerOptions } from "../../utils/createDefaultCompilerOptions";
import { getSourceFile } from "./getSourceFile";
import { createCompiler } from "../compiler";
import chokidar from "chokidar";
import { getCurrentDirectory } from "./getCurrentDirectory";
import { getCanonicalFileName } from "./getCanonicalFileName";
import { resolveModuleNames } from "./resolveModuleNames";
import { getTransformer } from "../../transform";
import { parseJsonFile } from "../../utils/parseJson";
import { parseConfigFile } from "./parseConfigFile";
const sss = ts.createCompilerHost({}, true)

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
  configFileParsingDiagnostics: ts.Diagnostic[] | undefined
  constructor(rootNames: string[] = [], options: ts.CompilerOptions = {}) {
    // console.log("🚀 --> file: index.ts --> line 38 --> createProgramHost --> constructor --> tsConfigs", tsConfigs.compilerOptions);
    this.rootNames = rootNames;
    this.options = options;
    this.defaultLibLocation = path.dirname(ts.sys.getExecutingFilePath());
    this.defaultLibFileName = path.join(this.defaultLibLocation, ts.getDefaultLibFileName(this.options));
    parseConfigFile(this);
    this.emit();
    // var parseConfigFileHost = ts.parseConfigHostFromCompilerHostLike(this, this);
    // console.log(ts.getParsedCommandLineOfConfigFile(configPath, {}, parseConfigFileHost))
  }
  watcher = chokidar.watch('.')
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
  writeFile = (filename: string, content: string) => {
    console.log('writeFile', filename)
  }
  emit() {
    return this.createProgram().emit(
      undefined,
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
      configFileParsingDiagnostics: this.configFileParsingDiagnostics
    })
  }
  close() {
    this.watcher.close()
  }
}

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
      // program.get
      // if (host && host.getSourceFile !== getSourceFile) {
      //   // host.getCustomTransformers = (): any => { }
      //   // host.getCustomTransformers
      //   // console.log(host && host.getSourceFile !== getSourceFile)
      //   // host.emit 
      //   // program.
      //   // program.emit = (...w): any => {
      //   //   console.log(w)
      //   // };
      //   host.getSourceFile = createGetSourceFile(host, options);
      // }
      return program
      // return ts.createSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);

    },
    reportDiagnostic,
    () => { },
  );

  // ts.getParsedCommandLineOfConfigFile(configFileName, optionsToExtendForConfigFile, parseConfigFileHost, extendedConfigCache || (extendedConfigCache = new ts.Map()), watchOptionsToExtend, extraFileExtensions)
  // host.resolveModuleNames = createModuleNamesResolver(host);
  // host.readFile = readFile;

  const watchProgram = ts.createWatchProgram(host)
  // const program = watchProgram.getProgram() 
  // createCompiler(program, rootFilesPath)


  return watchProgram;
};
