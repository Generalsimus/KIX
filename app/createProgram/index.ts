import path from "path";
import ts from "typescript";
import fs from "fs";
import { App } from "..";
import { reportDiagnostics } from "./reportDiagnostics";
import { readFile } from "./readFile";
import { getSourceFile } from "./getSourceFile";
import { getCurrentDirectory } from "./getCurrentDirectory";
import { getCanonicalFileName } from "./getCanonicalFileName";
import { resolveModuleNames } from "./resolveModuleNames";
import { getTransformer } from "../../transform";
import { useConfigFileParser } from "./useConfigFileParser";
import { diagnose } from "./diagnose";
import { getLocalFileWatcher } from "./getLocalFileWatcher";
import { Server } from "../../server";
import { writeFile } from "./writeFile";
import { getReportDiagnoseTime } from "./getReportDiagnoseTime";
// import { CacheController } from "./cacheController";
import { buildModules } from "./buildModules";
import { rootWriter } from "../rootWriter";
import { FileWatcher } from "./fileWatcher";
import { fixRootNames } from "./fixRootNames";
import { useRootFileWriter } from "./useRootFileWriter";
import { normalizeSlashes } from "../../utils/normalizeSlashes";
import { getDefaultLibFileName } from "./getDefaultLibFileName";
// const ss = ts.isArrayTypeNode
// const sss = ts.createCompilerHost({}, true)
// const ss = ts.DiagnosticCategory.Starting_compilation_in_watch_mode
// console.log("getDefaultLibLocation", ts.getDefaultLibFileName()); 
// ts.createCompilerDiagnostic

// ts.getParsedCommandLineOfConfigFile
// const configPath = getTsconfigFilePath();
// export const parseJsonFile = (fileName) => {
//   return fs.existsSync(fileName) ? parseConfigFileTextToJson(fileName, readFileSync(fileName, "utf8")).config : {}
// }
// ParsedCommandLine
// export const unicssssss = ts.factory.createUniqueName("unicssssss");
export class createProgramHost {
  rootNames: string[];
  moduleRootNamesSet: Set<string>;
  options: ts.CompilerOptions;
  oldProgram: ts.Program | undefined;
  defaultLibFileName: string;
  defaultLibLocation: string;
  configFileParsingDiagnostics = new Set<ts.Diagnostic>()
  reportDiagnoseTime: string = ""
  watch: boolean
  // cacheController: CacheController
  moduleRootWriter: rootWriter
  constructor(rootNames: string[] = [], options: ts.CompilerOptions = {}, watch: boolean = false, defaultModuleRootNames: string[] = []) {
    this.options = options;
    useConfigFileParser(this);
    this.defaultLibLocation = normalizeSlashes(path.dirname(ts.sys.getExecutingFilePath()));
    this.defaultLibFileName = getDefaultLibFileName(this.defaultLibLocation, this.options);
    this.watch = watch
    this.moduleRootNamesSet = new Set<string>(fixRootNames(this, defaultModuleRootNames, { isNodeModule: true }));
    useRootFileWriter(this.rootNames = fixRootNames(this, rootNames), this)
    this.moduleRootWriter = new rootWriter(path.join(App.runDirName, App.nodeModulesUrlPath), this, [], true)


    this.createProgram()
    this.emit();
    this.diagnose()
    this.buildModules(defaultModuleRootNames.length)
    this.getReportDiagnoseTime();
  }
  sourceFileCache = new Map<string, ts.SourceFile>()
  watcher = new FileWatcher();
  localFileWatcher = getLocalFileWatcher(this)
  server = new Server(this)
  transformer = getTransformer()
  buildModules = buildModules
  getReportDiagnoseTime = getReportDiagnoseTime
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
  writeFile = writeFile
  emit(sourceFile?: ts.SourceFile) {

    return this.oldProgram?.emit(
      sourceFile,
      undefined,
      undefined,
      undefined,
      this.transformer,
    );
  }
  createProgram(rootNames = this.rootNames, oldProgram = this.oldProgram) {
    return this.oldProgram = ts.createProgram({
      rootNames,
      options: this.options,
      oldProgram,
      host: this,
    })
  }
  close() {
    this.sourceFileCache.clear();
    this.watcher.close()
    this.server.close()
  }
}
// d?


// const runnnn = (rootNames: string[]) => {

//   // export const createProgram = (rootFilesPath: string[]) => {
//   const configPath = getTsconfigFilePath();

//   // createCompilerHostFromProgramHost
//   const host = ts.createWatchCompilerHost(
//     // undefined,
//     configPath,
//     { rootNames },
//     ts.sys,
//     ts.createSemanticDiagnosticsBuilderProgram,
//     // reportDiagnostic,
//     // () => { },
//   );

//   //   // ts.getParsedCommandLineOfConfigFile(configFileName, optionsToExtendForConfigFile, parseConfigFileHost, extendedConfigCache || (extendedConfigCache = new ts.Map()), watchOptionsToExtend, extraFileExtensions)
//   //   // host.resolveModuleNames = createModuleNamesResolver(host);
//   //   // host.readFile = readFile;

//   const watchProgram = ts.createWatchProgram(host)
//   //   // const program = watchProgram.getProgram()
//   //   // createCompiler(program, rootFilesPath)


//   //   return watchProgram;
//   // };
// }
