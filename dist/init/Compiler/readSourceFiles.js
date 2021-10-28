"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSourceFiles = void 0;
const App_1 = require("../App");
const { __SourceFileThreshold, __Printer, __Writer, __scriptTransformers, __declarationTransformers, __compilerOptions, __dirname, __Host, __Target } = App_1.App;
const readSourceFiles = (FilePath, sourceFiles = []) => {
    // const host = ts.createCompilerHost(__compilerOptions);
    // host.writeFile = (fileName, content) => {
    //     console.log("🚀 ---> file: readSourceFiles.js ---> line 87 ---> readSourceFiles ---> fileName, content", fileName, "content")
    // }
    // const sououced = host.getSourceFile
    // // host.getSourceFile = (...args) => {
    // //     console.log("🚀 ---> file: readSourceFiles.js ---> line 93 ---> readSourceFiles ---> args", args)
    // //     return sououced(...args)
    // // }
    // console.log("🚀 ---> file: readSourceFiles.js ---> line 98 ---> readSourceFiles ---> host", host)
    // host.readFile = (fileName) => {
    //     console.log("🚀 ---> file: , fileName", fileName)
    //     return fs.readFileSync(fileName, "utf8")
    // }
    // program = ts.createProgram([FilePath], __compilerOptions, host, program);
    // const files = program.getFilesByNameMap()
    // const getfiles = program.getSourceFiles
    // setInterval(() => {
    //     console.time("TEST" + i);
    //     // files.get(host.getCanonicalFileName(FilePath))
    //     const file = files.get(host.getCanonicalFileName(ts.normalizePath(FilePath)))
    //     files.set(host.getCanonicalFileName(ts.normalizePath(FilePath)), createSourceFile(
    //         FilePath,
    //         fs.readFileSync(FilePath, "utf8"),
    //         // @ts-ignore
    //         __Target,
    //         true,
    //         // @ts-ignore
    //         ts.ScriptKind["JS"]
    //     ))
    //     // file.version = (file.version ?? 0) + 1
    //     // console.log(syntaxTreeCache.getCurrentSourceFile)
    //     // console.log("🚀  ---> setInterval ---> files", file ) 
    //     program.emit()
    //     console.timeEnd("TEST" + i);
    // }, 1500)
};
exports.readSourceFiles = readSourceFiles;
//# sourceMappingURL=readSourceFiles.js.map